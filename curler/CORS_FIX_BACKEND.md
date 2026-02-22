# How to Fix CORS in Your Django Backend

CORS (Cross-Origin Resource Sharing) is a security feature enforced by browsers. Your backend API needs to explicitly allow requests from your frontend domain.

## Solution: Enable CORS in Django

### Step 1: Install django-cors-headers

```bash
pip install django-cors-headers
```

### Step 2: Update Django Settings

Find your Django `settings.py` file and make these changes:

#### Add to INSTALLED_APPS:
```python
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',  # Add this
    # ... rest of your apps
]
```

#### Add to MIDDLEWARE (at the top, before CommonMiddleware):
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    'django.middleware.common.CommonMiddleware',
    # ... rest of middleware
]
```

#### Add CORS Configuration:

**Option A: Allow All Origins (Development Only)**
```python
# WARNING: Only use this for local development!
CORS_ALLOW_ALL_ORIGINS = True
```

**Option B: Allow Specific Origins (Recommended for Production)**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://your-frontend-domain.com",
]
```

#### Allow Specific Headers (Required for your API):
```python
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'api-id',           # Your custom header
    'x-api-key',        # Your custom header
    'enterprise-id',    # Your custom header
]
```

#### Allow Credentials (if needed):
```python
CORS_ALLOW_CREDENTIALS = True
```

### Step 3: Restart Django Server

After making these changes, restart your Django development server:
```bash
python manage.py runserver
```

## Complete Example Configuration

```python
# settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # Add this
    'openapi',
    # ... your other apps
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this first
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = True  # For development only

# Or for production:
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:8000",
#     "https://your-production-domain.com",
# ]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'api-id',
    'x-api-key',
    'enterprise-id',
]

CORS_ALLOW_CREDENTIALS = True
```

## After Enabling CORS

Once you've enabled CORS in your backend:

1. **Disable the proxy** in your frontend by editing `curler/js/environment-manager.js`:
   ```javascript
   this.useCorsProxy = false; // Disable proxy
   ```

2. **Restart your Django server**

3. **Refresh your frontend** and try executing requests - they should work now!

## Testing

To verify CORS is working:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Execute a request from your frontend
4. Check the response headers - you should see:
   - `Access-Control-Allow-Origin: *` (or your specific domain)
   - `Access-Control-Allow-Headers: ...`

## Security Note

- **Development**: `CORS_ALLOW_ALL_ORIGINS = True` is fine
- **Production**: Use `CORS_ALLOWED_ORIGINS` with specific domains only
- Never expose sensitive APIs with `CORS_ALLOW_ALL_ORIGINS = True` in production

## Alternative: API Gateway CORS

If your API is behind AWS API Gateway (which it appears to be based on the URL), you can also enable CORS in API Gateway:

1. Go to AWS API Gateway Console
2. Select your API
3. Select the resource/method
4. Click "Enable CORS"
5. Add your custom headers: `api-id`, `x-api-key`, `enterprise-id`
6. Deploy the API

This is often easier than modifying Django code if you're using API Gateway.
