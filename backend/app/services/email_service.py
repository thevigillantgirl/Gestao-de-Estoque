import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional

def send_email(subject: str, body: str, to_email: str):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    try:
        smtp_port = int(os.getenv("SMTP_PORT", 587))
    except (ValueError, TypeError):
        smtp_port = 587
        
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    email_from = os.getenv("EMAIL_FROM", smtp_user)

    if not all([smtp_user, smtp_pass]):
        print(f"DEBUG: Configurações SMTP ausentes. E-mail simulado para {to_email}: {subject}")
        # print(body) # Uncomment for local debug if needed
        return True # Simulated success if no credentials

    msg = MIMEMultipart()
    msg['From'] = email_from
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        return False

def send_access_request_notification(name: str, email: str, company: Optional[str], message: Optional[str]):
    admin_email = os.getenv("EMAIL_ADMIN_TO", "rochamarialuiza591@gmail.com")
    subject = "Nova solicitação de acesso - ERP Gestão PRO"
    
    body = f"""
    Uma nova solicitação de acesso foi recebida.

    Nome: {name}
    E-mail: {email}
    Empresa: {company or "Não informado"}
    Mensagem/Motivo: {message or "Sem comentário"}

    Por favor, acesse o painel administrativo para aprovar ou rejeitar esta solicitação.
    """
    
    return send_email(subject, body, admin_email)
def send_approval_notification(to_email: str, name: str):
    subject = "Acesso Liberado - ERP Gestão PRO"
    body = f"""
    Olá {name},

    Sua solicitação de acesso ao sistema de Gestão de Estoque foi APROVADA!
    Você já pode acessar a plataforma utilizando o e-mail: {to_email}

    Se você ainda não definiu sua senha, entre em contato com seu administrador.

    Atenciosamente,
    Equipe de Administração
    """
    return send_email(subject, body, to_email)
