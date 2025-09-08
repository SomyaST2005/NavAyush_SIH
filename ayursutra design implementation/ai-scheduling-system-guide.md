# AI Scheduling System Implementation Guide

## Overview

The AI Scheduling System is the core intelligence of AyurSutra that automatically optimizes appointment scheduling, manages conflicts, and provides intelligent recommendations for treatment timing based on Ayurvedic principles and patient data.

## System Architecture

The AI Scheduling System is implemented as a Python microservice that integrates with the Node.js backend via REST API calls. This maintains the AI algorithms in Python while allowing seamless integration with the Express.js backend.

```
AI Scheduling Service (Python)/
├── algorithms/
│   ├── conflict_resolution.py
│   ├── treatment_optimizer.py
│   ├── availability_matcher.py
│   └── ayurvedic_timing.py
├── models/
│   ├── scheduling_model.py
│   ├── patient_preference.py
│   └── practitioner_availability.py
├── services/
│   ├── scheduler_service.py
│   ├── optimization_service.py
│   └── backend_client.py
└── api/
    ├── scheduling_api.py
    └── health_check.py

Node.js Backend Integration/
├── services/
│   └── aiSchedulingService.js
├── routes/
│   └── scheduling.js
└── middleware/
    └── aiServiceAuth.js
```

## Core Components

### 1. Backend Client Service (Python AI Service)

```python
# services/backend_client.py
import httpx
import os
from typing import Dict, List, Optional
from datetime import datetime

class BackendClient:
    def __init__(self):
        self.backend_url = os.getenv('BACKEND_URL', 'http://localhost:8000')
        self.api_key = os.getenv('AI_SERVICE_API_KEY')
        self.client = httpx.AsyncClient(
            base_url=self.backend_url,
            headers={'X-API-Key': self.api_key}
        )
    
    async def get_appointments(self, date_from: str, date_to: str) -> List[Dict]:
        """Get appointments from backend"""
        response = await self.client.get(
            f'/api/appointments?from={date_from}&to={date_to}'
        )
        return response.json()
    
    async def get_practitioners(self) -> List[Dict]:
        """Get all practitioners"""
        response = await self.client.get('/api/practitioners')
        return response.json()
    
    async def get_patient(self, patient_id: int) -> Dict:
        """Get patient details"""
        response = await self.client.get(f'/api/patients/{patient_id}')
        return response.json()
    
    async def create_appointment(self, appointment_data: Dict) -> Dict:
        """Create appointment in backend"""
        response = await self.client.post('/api/appointments', json=appointment_data)
        return response.json()
    
    async def update_appointment(self, appointment_id: int, data: Dict) -> Dict:
        """Update appointment in backend"""
        response = await self.client.put(f'/api/appointments/{appointment_id}', json=data)
        return response.json()
```

### 2. Main Scheduling Service (Python AI Service)

```python
# services/scheduler_service.py
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from .optimization_service import OptimizationService
from .backend_client import BackendClient
from ..algorithms.conflict_resolution import ConflictResolver
from ..algorithms.treatment_optimizer import TreatmentOptimizer

class SchedulerService:
    def __init__(self):
        self.optimization_service = OptimizationService()
        self.backend_client = BackendClient()
        self.conflict_resolver = ConflictResolver()
        self.treatment_optimizer = TreatmentOptimizer()
    
    async def schedule_appointment(self, appointment_request: Dict) -> Dict:
        """Main scheduling logic with AI optimization"""
        try:
            # Extract request data
            patient_id = appointment_request['patient_id']
            practitioner_id = appointment_request.get('practitioner_id')
            treatment_type = appointment_request['treatment_type']
            preferred_date = appointment_request.get('preferred_date')
            preferred_time = appointment_request.get('preferred_time')
            duration = appointment_request.get('duration', 60)  # minutes
            
            # Get patient data from backend
            patient_data = await self.backend_client.get_patient(patient_id)
            
            # Find optimal practitioner if not specified
            if not practitioner_id:
                practitioners = await self.backend_client.get_practitioners()
# algorithms/treatment_optimizer.py
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List
from ..models.scheduling_model import SchedulingModel

class TreatmentOptimizer:
    def __init__(self):
        self.model = SchedulingModel()
        self.ayurvedic_timings = {
            'abhyanga': {'optimal_hours': [9, 10, 11], 'duration': 60},
            'swedana': {'optimal_hours': [10, 11, 14, 15], 'duration': 45},
            'shirodhara': {'optimal_hours': [16, 17, 18], 'duration': 90},
            'panchakarma': {'optimal_hours': [8, 9, 10], 'duration': 120}
        }
    
    async def generate_optimal_slots(self, patient_data: Dict, practitioner: Dict,
                                   treatment_type: str, preferred_time: str = None) -> List[Dict]:
        """Generate optimal time slots using AI and Ayurvedic principles"""
        
        slots = []
        base_date = datetime.now().date()
        
        # Generate slots for next 14 days
        for day_offset in range(14):
            current_date = base_date + timedelta(days=day_offset)
            
            # Skip if practitioner not available
            if not self.is_practitioner_available(practitioner, current_date):
                continue
            
            # Get optimal hours for treatment type
            optimal_hours = self.ayurvedic_timings.get(treatment_type, {}).get('optimal_hours', [9, 10, 11, 14, 15])
            
            for hour in optimal_hours:
                slot_time = datetime.combine(current_date, datetime.min.time().replace(hour=hour))
                
                # Calculate confidence score using AI model
                confidence_score = await self.calculate_confidence_score(
                    patient_data, practitioner, treatment_type, slot_time
                )
                
                if confidence_score > 0.5:  # Only include high-confidence slots
                    slots.append({
                        'datetime': slot_time,
                        'practitioner_id': practitioner['id'],
                        'treatment_type': treatment_type,
                        'confidence_score': confidence_score,
                        'ayurvedic_optimal': hour in self.ayurvedic_timings.get(treatment_type, {}).get('optimal_hours', []),
                        'estimated_duration': self.ayurvedic_timings.get(treatment_type, {}).get('duration', 60)
                    })
        
        return sorted(slots, key=lambda x: x['confidence_score'], reverse=True)
    
    async def calculate_confidence_score(self, patient_data: Dict, practitioner: Dict,
                                       treatment_type: str, slot_time: datetime) -> float:
        """Calculate AI confidence score for a time slot"""
        
        features = self.extract_features(patient_data, practitioner, treatment_type, slot_time)
        confidence = await self.model.predict_success_probability(features)
        
        # Apply Ayurvedic timing bonus
        ayurvedic_bonus = self.get_ayurvedic_timing_bonus(treatment_type, slot_time.hour)
        
        # Apply patient preference bonus
        preference_bonus = self.get_patient_preference_bonus(patient_data, slot_time)
        
        # Apply practitioner efficiency bonus
        efficiency_bonus = self.get_practitioner_efficiency_bonus(practitioner, slot_time)
        
        final_score = min(1.0, confidence + ayurvedic_bonus + preference_bonus + efficiency_bonus)
        
        return final_score
    
    def extract_features(self, patient_data: Dict, practitioner: Dict,
                        treatment_type: str, slot_time: datetime) -> np.ndarray:
        """Extract features for ML model"""
        
        features = [
            slot_time.hour,  # Hour of day
            slot_time.weekday(),  # Day of week
            patient_data.get('age', 35),  # Patient age
            patient_data.get('constitution_score', 0.5),  # Ayurvedic constitution
            practitioner.get('experience_years', 5),  # Practitioner experience
            practitioner.get('specialization_match', 0.8),  # Treatment specialization match
            len(patient_data.get('previous_treatments', [])),  # Treatment history
            patient_data.get('response_rate', 0.7),  # Historical response to treatments
        ]
        
        return np.array(features)
    
    def find_optimal_practitioner(self, treatment_type: str, patient_data: Dict, practitioners: List[Dict]) -> Optional[int]:
        """Find the best practitioner for the treatment and patient"""
        best_practitioner = None
        best_score = 0
        
        for practitioner in practitioners:
            if treatment_type in practitioner.get('specializations', []):
                score = self.calculate_practitioner_score(practitioner, patient_data)
                if score > best_score:
                    best_score = score
                    best_practitioner = practitioner['id']
        
        return best_practitioner
        conflicts.extend(facility_conflicts)
        
        # Check patient conflicts
        patient_conflicts = await self.check_patient_availability(proposed_slot)
        conflicts.extend(patient_conflicts)
        
        return conflicts
    
    async def resolve_conflicts(self, proposed_slot: Dict, conflicts: List[Dict]) -> Dict:
        """Automatically resolve scheduling conflicts"""
        
        for strategy in self.resolution_strategies:
            resolution = await self.apply_resolution_strategy(strategy, proposed_slot, conflicts)
            
            if resolution['success']:
                return resolution['resolved_slot']
        
        # If automatic resolution fails, return alternatives
        alternatives = await self.generate_alternatives(proposed_slot)
        return {
            'success': False,
            'alternatives': alternatives,
            'conflicts': conflicts
        }
    
    async def apply_resolution_strategy(self, strategy: str, slot: Dict, conflicts: List[Dict]) -> Dict:
        """Apply specific conflict resolution strategy"""
        
        if strategy == 'reschedule_adjacent':
            return await self.reschedule_to_adjacent_slot(slot, conflicts)
        
        elif strategy == 'find_alternative_practitioner':
            return await self.find_alternative_practitioner(slot, conflicts)
        
        elif strategy == 'suggest_different_time':
            return await self.suggest_different_time(slot, conflicts)
        
        elif strategy == 'split_long_treatment':
            return await self.split_long_treatment(slot, conflicts)
        
        return {'success': False}
```

### 4. API Endpoints

```python
# api/scheduling_api.py
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from ..services.scheduler_service import SchedulerService

app = FastAPI()
scheduler = SchedulerService()

class AppointmentRequest(BaseModel):
    patient_id: str
    treatment_type: str
    preferred_time: Optional[str] = None
    practitioner_id: Optional[str] = None
    priority: Optional[str] = "normal"

class ReschedulingRequest(BaseModel):
    appointment_id: str
    new_preferred_time: Optional[str] = None
    reason: Optional[str] = None

@app.post("/api/scheduling/book")
async def book_appointment(request: AppointmentRequest):
    """Book new appointment with AI optimization"""
    result = await scheduler.schedule_appointment(request.dict())
    
    if result['success']:
        return {
            "appointment": result['appointment'],
            "ai_confidence": result['ai_confidence'],
            "message": "Appointment scheduled successfully"
        }
    else:
        raise HTTPException(status_code=400, detail=result['error'])

@app.get("/api/scheduling/recommendations/{patient_id}")
async def get_recommendations(patient_id: str, treatment_type: str, 
                            preferred_time: Optional[str] = None):
    """Get AI scheduling recommendations"""
    recommendations = await scheduler.get_scheduling_recommendations(
        patient_id, treatment_type, preferred_time, None
    )
    
    return {
        "recommendations": recommendations,
        "total_options": len(recommendations)
    }

@app.post("/api/scheduling/reschedule")
async def reschedule_appointment(request: ReschedulingRequest):
    """Reschedule existing appointment"""
    result = await scheduler.reschedule_appointment(request.dict())
    return result

@app.get("/api/scheduling/conflicts/{date}")
async def check_conflicts(date: str):
    """Check for scheduling conflicts on specific date"""
    conflicts = await scheduler.check_daily_conflicts(date)
    return {"conflicts": conflicts, "total": len(conflicts)}

@app.post("/api/scheduling/optimize")
async def optimize_schedule():
    """Optimize entire schedule using AI"""
    result = await scheduler.optimize_full_schedule()
    return result
```

## Machine Learning Model

```python
# models/scheduling_model.py
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

class SchedulingModel:
    def __init__(self):
        self.model = None
        self.is_trained = False
        self.feature_names = [
            'hour_of_day', 'day_of_week', 'patient_age', 'constitution_score',
            'practitioner_experience', 'specialization_match', 'treatment_history',
            'response_rate'
        ]
    
    async def train_model(self, training_data: List[Dict]):
        """Train the scheduling optimization model"""
        
        # Prepare training data
        X, y = self.prepare_training_data(training_data)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        self.is_trained = True
        
        return {
            'train_accuracy': train_score,
            'test_accuracy': test_score,
            'feature_importance': dict(zip(self.feature_names, self.model.feature_importances_))
        }
    
    async def predict_success_probability(self, features: np.ndarray) -> float:
        """Predict success probability for a time slot"""
        
        if not self.is_trained:
            # Use rule-based fallback
            return self.rule_based_prediction(features)
        
        prediction = self.model.predict([features])[0]
        return max(0.0, min(1.0, prediction))  # Clamp between 0 and 1
    
    def rule_based_prediction(self, features: np.ndarray) -> float:
        """Fallback rule-based prediction when ML model not available"""
        
        hour = features[0]
        day_of_week = features[1]
        patient_age = features[2]
        
        score = 0.5  # Base score
        
        # Time of day preferences
        if 9 <= hour <= 11:
            score += 0.2
        elif 14 <= hour <= 16:
            score += 0.1
        
        # Day of week preferences
        if day_of_week < 5:  # Weekdays
            score += 0.1
        
        # Age considerations
        if patient_age > 60:
            if hour < 12:  # Morning preferred for elderly
                score += 0.1
        
        return min(1.0, score)
```

## Integration with Frontend

```javascript
// services/schedulingService.js
import axios from 'axios';

class SchedulingService {
  constructor() {
    this.baseURL = '/api/scheduling';
  }

  async bookAppointment(appointmentData) {
    try {
      const response = await axios.post(`${this.baseURL}/book`, appointmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Booking failed');
    }
  }

  async getRecommendations(patientId, treatmentType, preferredTime = null) {
    try {
      const params = { treatment_type: treatmentType };
      if (preferredTime) params.preferred_time = preferredTime;
      
      const response = await axios.get(`${this.baseURL}/recommendations/${patientId}`, { params });
      return response.data.recommendations;
    } catch (error) {
      throw new Error('Failed to get recommendations');
    }
  }

  async rescheduleAppointment(appointmentId, newTime, reason = null) {
    try {
      const response = await axios.post(`${this.baseURL}/reschedule`, {
        appointment_id: appointmentId,
        new_preferred_time: newTime,
        reason
      });
      return response.data;
    } catch (error) {
      throw new Error('Rescheduling failed');
    }
  }
}

export default new SchedulingService();
```

## Key Features

### 1. Intelligent Scheduling
- AI-powered time slot optimization
- Ayurvedic timing principles integration
- Patient preference learning
- Practitioner efficiency optimization

### 2. Conflict Resolution
- Automatic conflict detection
- Multiple resolution strategies
- Alternative suggestion generation
- Real-time availability checking

### 3. Predictive Analytics
- Treatment success probability prediction
- Optimal timing recommendations
- Resource utilization optimization
- Patient satisfaction prediction

### 4. Ayurvedic Integration
- Traditional timing principles
- Constitution-based scheduling
- Treatment sequence optimization
- Seasonal considerations

## Deployment Configuration

```yaml
# docker-compose.yml
version: '3.8'
services:
  ai-scheduler:
    build: ./ai-service
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - ML_MODEL_PATH=/app/models/
    volumes:
      - ./models:/app/models
    depends_on:
      - postgres
      - redis
```

This AI Scheduling System provides intelligent, automated appointment management with conflict resolution and optimization capabilities essential for Phase 1 of AyurSutra.
