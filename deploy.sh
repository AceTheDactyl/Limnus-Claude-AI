#!/bin/bash
# Living Loom Deployment Script

set -e

# Configuration
ENVIRONMENT=${1:-staging}
DOMAIN_NAME=${2:-livingloom.app}
AWS_REGION=${3:-us-east-1}
STACK_NAME="living-loom-${ENVIRONMENT}"

echo "🚀 Deploying Living Loom to AWS"
echo "Environment: $ENVIRONMENT"
echo "Domain: $DOMAIN_NAME"
echo "Region: $AWS_REGION"
echo "Stack: $STACK_NAME"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Not logged in to AWS. Please run 'aws configure' first."
    exit 1
fi

# Generate a secure database password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
echo "Generated database password: $DB_PASSWORD"

echo "📦 Step 1: Building Expo web app..."
npx expo export:web

echo "☁️ Step 2: Deploying AWS infrastructure..."
aws cloudformation deploy \
    --template-file aws-infrastructure.yml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        Environment=$ENVIRONMENT \
        DomainName=$DOMAIN_NAME \
        DatabasePassword=$DB_PASSWORD \
    --capabilities CAPABILITY_IAM \
    --region $AWS_REGION

echo "📤 Step 3: Getting S3 bucket name..."
S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text \
    --region $AWS_REGION)

echo "S3 Bucket: $S3_BUCKET"

echo "📤 Step 4: Uploading web app to S3..."
aws s3 sync dist/ s3://$S3_BUCKET --delete --region $AWS_REGION

echo "🔄 Step 5: Getting CloudFront distribution ID..."
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text \
    --region $AWS_REGION)

echo "Distribution ID: $DISTRIBUTION_ID"

echo "🔄 Step 6: Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --region $AWS_REGION

echo "📊 Step 7: Getting deployment URLs..."
WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text \
    --region $AWS_REGION)

API_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
    --output text \
    --region $AWS_REGION)

DB_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
    --output text \
    --region $AWS_REGION)

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Website URL: $WEBSITE_URL"
echo "🔗 API URL: $API_URL"
echo "🗄️ Database Endpoint: $DB_ENDPOINT"
echo "🔑 Database Password: $DB_PASSWORD"
echo ""
echo "📱 PWA Installation:"
echo "   - Visit $WEBSITE_URL in Chrome/Edge"
echo "   - Click 'Install' button in address bar"
echo "   - Or use browser menu → Install app"
echo ""
echo "🔧 Next Steps:"
echo "   1. Update your backend to use the database endpoint"
echo "   2. Configure DNS if using custom domain"
echo "   3. Test PWA installation on mobile devices"
echo "   4. Set up monitoring and alerts"
echo ""

# Save deployment info to file
cat > deployment-info.json << EOF
{
  "environment": "$ENVIRONMENT",
  "domain": "$DOMAIN_NAME",
  "region": "$AWS_REGION",
  "stackName": "$STACK_NAME",
  "websiteUrl": "$WEBSITE_URL",
  "apiUrl": "$API_URL",
  "databaseEndpoint": "$DB_ENDPOINT",
  "databasePassword": "$DB_PASSWORD",
  "s3Bucket": "$S3_BUCKET",
  "distributionId": "$DISTRIBUTION_ID",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "💾 Deployment info saved to deployment-info.json"
echo "⚠️  Keep deployment-info.json secure - it contains sensitive information!"