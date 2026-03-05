import requests
import json
from .. import models, schemas, security
from ..security import get_db, get_current_user

router = APIRouter(prefix="/integrations", tags=["Integrations"])

@router.post("/endpoints", response_model=schemas.IntegrationEndpoint)
def create_endpoint(endpoint: schemas.IntegrationEndpointCreate, db: Session = Depends(get_db)):
    new_endpoint = models.IntegrationEndpoint(**endpoint.model_dump())
    db.add(new_endpoint)
    db.commit()
    db.refresh(new_endpoint)
    return new_endpoint

@router.get("/endpoints", response_model=List[schemas.IntegrationEndpoint])
def list_endpoints(db: Session = Depends(get_db)):
    return db.query(models.IntegrationEndpoint).all()

@router.post("/dispatch/{event_type}")
def dispatch_events(event_type: str, db: Session = Depends(get_db)):
    # 1. Get active endpoints for this event type
    endpoints = db.query(models.IntegrationEndpoint).filter(
        models.IntegrationEndpoint.event_type == event_type,
        models.IntegrationEndpoint.is_active == True
    ).all()

    if not endpoints:
        return {"message": f"No active endpoints for event type: {event_type}"}

    # 2. Get pending events (limit 50)
    events = db.query(models.IntegrationEvent).filter(
        models.IntegrationEvent.event_type == event_type,
        models.IntegrationEvent.status == "PENDING"
    ).limit(50).all()

    dispatched_count = 0
    failed_count = 0

    for event in events:
        payload = {
            "event_type": event.event_type,
            "payload": json.loads(event.payload_json)
        }
        
        event_sent_successfully = False
        last_error = ""

        for endpoint in endpoints:
            headers = {"Content-Type": "application/json"}
            if endpoint.secret:
                headers["X-Webhook-Secret"] = endpoint.secret
            
            try:
                response = requests.post(
                    endpoint.target_url,
                    json=payload,
                    headers=headers,
                    timeout=5
                )
                if 200 <= response.status_code < 300:
                    event_sent_successfully = True
                else:
                    last_error = f"Endpoint {endpoint.name} returned {response.status_code}"
            except Exception as e:
                last_error = f"Error calling endpoint {endpoint.name}: {str(e)}"

        if event_sent_successfully:
            event.status = "SENT"
            event.last_error = None
            dispatched_count += 1
        else:
            event.status = "FAILED"
            event.last_error = last_error
            failed_count += 1
        
    db.commit()

    return {
        "event_type": event_type,
        "dispatched": dispatched_count,
        "failed": failed_count,
        "message": "Dispatch cycle completed"
    }
