import sys
import os
sys.path.insert(0, r'C:\Users\SILASL~1\AppData\Local\Temp\opencode\mantis_shadow\plan_fixed')
with open(r'C:\Users\SILASL~1\AppData\Local\Temp\opencode\mantis_shadow\reached.marker', 'w') as f:
    f.write('MANTIS_REACHED_ENTRYPOINT')
    f.flush()
    os.fsync(f.fileno())
import app.api.routes.contact
