from rest_framework import permissions


class IsTaskOwnerPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user == obj.user:
            return True
        return False
