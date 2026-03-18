from email_notification.structures import EmailNotificationData
from email_notification.template_names import TemplateNameChoices
from email_notification.task import handle_send_email


def send_vendor_email(*, receivers, email_data):
    template_name = TemplateNameChoices.VENDOR_DIRECTORY_INVITATION
    template_parameters = {
        "invitation_id": email_data.invitation_id,
        "invitation_code": email_data.invitation_code,
        "name": email_data.name,
        "enterprise_name": email_data.enterprise_name,
        "invited_by_name": email_data.invited_by_name,
    }
    email_notification_data = EmailNotificationData(
        receivers=receivers,
        template_name=template_name,
        template_parameters=template_parameters,
    )
    handle_send_email(email_notification_data)


def send_vendor_contact_email(*, receivers, email_data):
    template_name = TemplateNameChoices.VENDOR_DIRECTORY_CONTACT_INVITATION
    template_parameters = {
        "invitation_id": email_data.invitation_id,
        "invitation_code": email_data.invitation_code,
        "name": email_data.name,
        "buyer_entity": email_data.buyer_entity,
        "primary_contact_added_by": email_data.primary_contact_added_by,
        "seller_entity": email_data.seller_entity,
    }
    email_notification_data = EmailNotificationData(
        receivers=receivers,
        template_name=template_name,
        template_parameters=template_parameters,
    )
    handle_send_email(email_notification_data)
