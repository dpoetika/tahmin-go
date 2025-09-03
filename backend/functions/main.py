from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from firebase_admin import initialize_app
import os

# Firebase yapılandırması
set_global_options(max_instances=10)
initialize_app()

# Flask uygulamasını oluştur
from app import create_app
app = create_app()

# PORT environment variable'ını al (Cloud Run bu değişkeni otomatik set eder)
PORT = int(os.environ.get("PORT", 8080))

# Firebase Functions için handler
@https_fn.on_request()
def httpsflaskexample(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()

# Cloud Run için doğrudan çalıştırma (gerekli)
if __name__ == "__main__":
    # Cloud Run PORT environment variable'ını kullan
    app.run(host="0.0.0.0", port=PORT, debug=False)