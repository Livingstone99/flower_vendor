"""
Manual test script for nursery CRUD endpoints.

Run this after logging in as an admin user to test all nursery CRUD operations.
"""

import requests

BASE_URL = "http://localhost:8000"

# You need to get a valid admin token first
# Login with admin credentials to get the token
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "admin@example.com", "password": "your_password"}
)
token = login_response.json()["access_token"]

headers = {"Authorization": f"Bearer {token}"}

# Test 1: Create a nursery
print("1. Creating nursery...")
create_response = requests.post(
    f"{BASE_URL}/admin/nurseries",
    json={
        "internal_name": "Test Nursery",
        "city": "Abidjan",
        "commune": "Cocody",
        "latitude": "5.359952",
        "longitude": "-4.008256"
    },
    headers=headers
)
print(f"Status: {create_response.status_code}")
nursery = create_response.json()
print(f"Created: {nursery}")
nursery_id = nursery["id"]

# Test 2: List all nurseries
print("\n2. Listing all nurseries...")
list_response = requests.get(f"{BASE_URL}/admin/nurseries", headers=headers)
print(f"Status: {list_response.status_code}")
print(f"Count: {len(list_response.json())}")

# Test 3: Get single nursery by ID
print(f"\n3. Getting nursery {nursery_id}...")
get_response = requests.get(f"{BASE_URL}/admin/nurseries/{nursery_id}", headers=headers)
print(f"Status: {get_response.status_code}")
print(f"Nursery: {get_response.json()}")

# Test 4: Update nursery
print(f"\n4. Updating nursery {nursery_id}...")
update_response = requests.patch(
    f"{BASE_URL}/admin/nurseries/{nursery_id}",
    json={"internal_name": "Test Nursery Updated"},
    headers=headers
)
print(f"Status: {update_response.status_code}")
print(f"Updated: {update_response.json()}")

# Test 5: Delete nursery
print(f"\n5. Deleting nursery {nursery_id}...")
delete_response = requests.delete(f"{BASE_URL}/admin/nurseries/{nursery_id}", headers=headers)
print(f"Status: {delete_response.status_code}")

# Test 6: Verify deletion
print(f"\n6. Verifying deletion...")
verify_response = requests.get(f"{BASE_URL}/admin/nurseries/{nursery_id}", headers=headers)
print(f"Status: {verify_response.status_code} (should be 404)")

print("\n✅ All tests completed!")
