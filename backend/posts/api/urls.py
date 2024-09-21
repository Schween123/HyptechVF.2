
from rest_framework.routers import DefaultRouter
from django.urls import path
from . import views
from .views import OwnerViewSet, BoardingHouseViewSet, RoomViewSet, TenantViewSet, GuardianViewSet, TransactionViewSet, DashboardDataViewSet, GcashTransactionViewSet

router = DefaultRouter()
router.register(r'owner', OwnerViewSet)
router.register(r'boardinghouse', BoardingHouseViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'tenant', TenantViewSet)
router.register(r'guardian', GuardianViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'gcashtransactions', GcashTransactionViewSet, basename='gcashtransaction')

# Add router-generated URLs to urlpatterns
urlpatterns = router.urls