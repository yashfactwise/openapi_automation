from django.urls import path

# from openapi.views import rfq_views
# from openapi.views import terms_and_conditions_views
from openapi.views import (
    contract_views,
    default_views,
    item_views,
    po_views,
    project_views,
    vendor_views,
)

# from openapi.views import address_views
# from openapi.views import identification_views
from factwise.openapi.views import costing_sheet_views

app_name = "openapi"
urlpatterns = []

po_urls = [
    # path(
    #     "purchase_orders/",
    #     po_views.PurchaseOrderListAPI.as_view(),
    #     name="list",
    # ),
    path(
        "purchase_order/create/",
        po_views.PurchaseOrderCreateAPI.as_view(),
        name="create_purchase_order",
    ),
    path(
        "purchase_order/update/",
        po_views.PurchaseOrderUpdateAPI.as_view(),
        name="update_purchase_order",
    ),
    path(
        "purchase_order/state/",
        po_views.PurchaseOrderStatusAPI.as_view(),
        name="state_purchase_order",
    ),
    path(
        "purchase_order/terminate/",
        po_views.PurchaseOrderUpdateTerminationAPI.as_view(),
        name="terminate_purchase_order",
    ),
    # path(
    #     "purchase_orders/<str:purchase_order_id>/",
    #     po_views.PurchaseOrderDetailAPI.as_view(),
    #     name="detail",
    # ),
    # path(
    #     "purchase_order/create/direct/",
    #     po_views.PurchaseOrderDirectCreateAPI.as_view(),
    # ),
]

contract_urls = [
    path(
        "contract/create/",
        contract_views.ContractCreateAPI.as_view(),
        name="create_contract",
    ),
    path(
        "contract/update/",
        contract_views.ContractUpdateAPI.as_view(),
        name="update_contract",
    ),
    path(
        "contract/state/",
        contract_views.ContractStatusAPI.as_view(),
        name="state_contract",
    ),
]

rfq_urls = [
    # path(
    #     "rfq/",
    #     rfq_views.RfqListAPI.as_view(),
    # ),
]

address_urls = [
    # path(
    #     "address/",
    #     address_views.AddressListAPI.as_view(),
    # ),
    # path(
    #     "address/create/",
    #     address_views.AddressCreateAPI.as_view(),
    # ),
]

identification_urls = [
    # path(
    #     "identifications/",
    #     identification_views.IdentificationListAPI.as_view(),
    # ),
    # path(
    #     "identifications/create/",
    #     identification_views.IdentificationCreateAPI.as_view(),
    # ),
]

item_urls = [
    # path(
    #     "items/",
    #     item_views.EnterpriseItemListAPI.as_view(),
    # ),
    path(
        "items/create/",
        item_views.CreateItemAPI.as_view(),
    ),
    path(
        "items/bulk-create/",
        item_views.BulkCreateItemAPI.as_view(),
        name="bulk_create_item",
    ),
    path(
        "items/update/",
        item_views.UpdateItemAPI.as_view(),
    ),
    path(
        "items/bulk-update/",
        item_views.BulkUpdateItemAPI.as_view(),
    ),
    path(
        "items/update/state/",
        item_views.UpdateItemStateAPI.as_view(),
    ),
]

terms_and_conditions_urls = [
    # path(
    #     "terms_and_conditions/",
    #     terms_and_conditions_views.TermsAndConditionsListAPI.as_view(),
    # ),
    # path(
    #     "terms_and_conditions/create/",
    #     terms_and_conditions_views.TermsAndConditionsCreateAPI.as_view(),
    # )
]

vendor_urls = [
    # path(
    #     "vendors/",
    #     vendor_views.EnterpriseVendorMasterListAPI.as_view(),
    # ),
    path(
        "vendors/create/",
        vendor_views.CreateEnterpriseVendorAPI.as_view(),
    ),
    path(
        "vendors/update/",
        vendor_views.UpdateEnterpriseVendorAPI.as_view(),
    ),
    # path(
    #     "vendors/contacts/",
    #     vendor_views.VendorContactListAPI.as_view(),
    # ),
    path(
        "vendors/contacts/create/",
        vendor_views.VendorContactCreateAPI.as_view(),
    ),
    path(
        "vendors/contacts/update/",
        vendor_views.VendorContactUpdateAPI.as_view(),
    ),
    path(
        "vendors/contacts/delete/",
        vendor_views.VendorContactDeleteAPI.as_view(),
    ),
    path(
        "vendors/state/",
        vendor_views.UpdateEnterpriseVendorStatusAPI.as_view(),
    ),
]

project_urls = [
    path(
        "project/create/",
        project_views.CreateProjectAPI.as_view(),
        name="create_project",
    ),
    path(
        "project/bulk-create/",
        project_views.BulkCreateProjectAPI.as_view(),
        name="bulk_create_project",
    ),
]


costing_sheet_urls = [
    path(
        "costing-sheet/",
        costing_sheet_views.CostingSheetListAPI.as_view(),
        name="list_costing_sheets",
    ),
    path(
        "costing-sheet/mapping/",
        costing_sheet_views.MapCostingSheetIDsAPI.as_view(),
        name="mapping_costing_sheet_ids",
    ),
]

default_url = [
    path(
        "",
        default_views.DefaultAPI.as_view(),
    ),
    path(
        "attachments/<uuid:attachment_id>/download/",
        default_views.AttachmentDownloadAPI.as_view(),
        name="attachment-download",
    ),
    path(
        "tasks/<uuid:task_id>/",
        default_views.BulkTaskStatusAPI.as_view(),
        name="bulk_task_status",
    ),
]

urlpatterns.extend(
    rfq_urls
    + contract_urls
    + po_urls
    + address_urls
    + identification_urls
    + item_urls
    + terms_and_conditions_urls
    + vendor_urls
    + project_urls
    + costing_sheet_urls
    + default_url
)
