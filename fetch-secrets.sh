#!/bin/bash
set -e

REGION="ap-southeast-2"
PROJECT_DIR="/home/ubuntu/hudyat-official"

SUPABASE_URL=$(aws ssm get-parameter \
  --name "/hudyat/prod/NEXT_PUBLIC_SUPABASE_URL" \
  --with-decryption \
  --region "$REGION" \
  --query "Parameter.Value" \
  --output text)

SUPABASE_ANON_KEY=$(aws ssm get-parameter \
  --name "/hudyat/prod/NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --with-decryption \
  --region "$REGION" \
  --query "Parameter.Value" \
  --output text)

cat > "$PROJECT_DIR/.env" << EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF

chmod 600 "$PROJECT_DIR/.env"

cd "$PROJECT_DIR"
docker compose up -d
