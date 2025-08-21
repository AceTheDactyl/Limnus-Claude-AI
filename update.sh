#!/bin/bash
# Quick update script for Living Loom PWA

set -e

ENVIRONMENT=${1:-staging}
STACK_NAME="living-loom-${ENVIRONMENT}"
AWS_REGION=${2:-us-east-1}

echo "🔄 Quick update for Living Loom PWA"
echo "Environment: $ENVIRONMENT"

# Build the app
echo "📦 Building Expo web app..."
npx expo export:web

# Get S3 bucket name
echo "📤 Getting S3 bucket name..."
S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text \
    --region $AWS_REGION)

if [ -z "$S3_BUCKET" ]; then
    echo "❌ Could not find S3 bucket. Make sure the stack is deployed first."
    exit 1
fi

echo "S3 Bucket: $S3_BUCKET"

# Upload to S3
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://$S3_BUCKET --delete --region $AWS_REGION

# Get CloudFront distribution ID
echo "🔄 Getting CloudFront distribution ID..."
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text \
    --region $AWS_REGION)

if [ -z "$DISTRIBUTION_ID" ]; then
    echo "❌ Could not find CloudFront distribution ID."
    exit 1
fi

echo "Distribution ID: $DISTRIBUTION_ID"

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text \
    --region $AWS_REGION)

echo "Invalidation ID: $INVALIDATION_ID"

# Get website URL
WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text \
    --region $AWS_REGION)

echo ""
echo "✅ Update completed successfully!"
echo "🌐 Website URL: $WEBSITE_URL"
echo "⏳ CloudFront cache invalidation in progress..."
echo "   It may take 5-15 minutes for changes to be visible globally."
echo ""
echo "🔍 Check invalidation status:"
echo "   aws cloudfront get-invalidation --distribution-id $DISTRIBUTION_ID --id $INVALIDATION_ID"