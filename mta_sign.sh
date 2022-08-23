#!/bin/bash
sleep 60
chromium-browser --force-device-scale-factor=2.0 --disable-restore-session-state --noerrdialogs --kiosk http://localhost:3000
chromium-browser --force-device-scale-factor=2.0 --disable-restore-session-state --noerrdialogs http://localhost:3000