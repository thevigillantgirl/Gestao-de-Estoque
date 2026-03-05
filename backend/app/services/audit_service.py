from sqlalchemy.orm import Session
from .. import models
from typing import Optional

def log_event(
    db: Session,
    event_type: str,
    user_id: Optional[int] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    path: str = "",
    method: str = "",
    status_code: Optional[int] = None,
    details: Optional[str] = None
):
    """
    Registra um evento de auditoria na tabela access_logs.
    Eventos sugeridos: LOGIN_SUCCESS, LOGIN_FAILED, ACCESS_REQUEST_CREATED, 
    USER_CREATED, USER_ROLE_UPDATED, USER_DISABLED, LOGOUT
    """
    log_entry = models.AccessLog(
        user_id=user_id,
        event_type=event_type,
        ip_address=ip_address,
        user_agent=user_agent,
        path=path,
        method=method,
        status_code=status_code,
        details=details
    )
    db.add(log_entry)
    db.commit()
    return log_entry
