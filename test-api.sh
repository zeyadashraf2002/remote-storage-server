#!/bin/bash

# 🧪 اختبار سريع للسيرفر

echo "🚀 بدء الاختبارات..."
echo ""

# الألوان
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# الـ Base URL
BASE_URL="http://localhost:3000"
API_KEY="test-api-key"

# 1️⃣ Health Check
echo -e "${YELLOW}1️⃣  اختبار Health Check...${NC}"
curl -s "$BASE_URL/health" | jq . && echo -e "${GREEN}✅ النتيجة: OK${NC}" || echo -e "${RED}❌ فشل${NC}"
echo ""

# 2️⃣ اختبر Upload بدون API Key (يجب يفشل)
echo -e "${YELLOW}2️⃣  اختبر Upload بدون Authorization (يجب يفشل)...${NC}"
curl -s -X POST \
  -F "file=@package.json" \
  -F "folder=test" \
  "$BASE_URL/upload" | jq .
echo ""

# 3️⃣ اختبر Upload مع API Key الصحيح
echo -e "${YELLOW}3️⃣  اختبر Upload مع Authorization...${NC}"
curl -s -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -F "file=@package.json" \
  -F "folder=documents" \
  "$BASE_URL/upload" | jq .
echo ""

# 4️⃣ اختبر Delete
echo -e "${YELLOW}4️⃣  اختبر Delete...${NC}"
curl -s -X DELETE \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"publicId":"documents/test-file.json"}' \
  "$BASE_URL/delete" | jq .
echo ""

echo -e "${GREEN}✅ انتهت الاختبارات!${NC}"
