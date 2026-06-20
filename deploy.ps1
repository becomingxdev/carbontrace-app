# =============================================================
# CarbonTrace — Google Cloud Run Deployment Script
# Run this from your own PowerShell terminal (not the agent terminal)
# Prerequisites: gcloud CLI authenticated, APIs already enabled
# =============================================================

$PROJECT_ID = "carbontrace-app"
$REGION     = "us-central1"
$SA_NAME    = "carbontrace-sa"
$SA_EMAIL   = "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
$REPO_NAME  = "carbontrace"
$SERVICE    = "carbontrace-app"

Write-Host "`n[1/5] Creating service account..." -ForegroundColor Cyan
gcloud iam service-accounts create $SA_NAME `
  --display-name="CarbonTrace Cloud Run SA" `
  --project=$PROJECT_ID

Write-Host "`n[2/5] Granting Vertex AI User role to service account..." -ForegroundColor Cyan
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SA_EMAIL" `
  --role="roles/aiplatform.user"

Write-Host "`n[3/5] Creating Artifact Registry Docker repository..." -ForegroundColor Cyan
gcloud artifacts repositories create $REPO_NAME `
  --repository-format=docker `
  --location=$REGION `
  --description="CarbonTrace Docker images" `
  --project=$PROJECT_ID

Write-Host "`n[4/5] Configuring Docker auth for Artifact Registry..." -ForegroundColor Cyan
gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet

Write-Host "`n[5/5] Deploying to Cloud Run (builds from source automatically)..." -ForegroundColor Cyan
# This single command: builds the Docker image, pushes to Artifact Registry,
# and deploys to Cloud Run — no local Docker daemon required.
gcloud run deploy $SERVICE `
  --source . `
  --region $REGION `
  --platform managed `
  --allow-unauthenticated `
  --service-account $SA_EMAIL `
  --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID,GCP_LOCATION=$REGION,NODE_ENV=production" `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10 `
  --concurrency 80 `
  --project $PROJECT_ID

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "Get your live URL with:" -ForegroundColor Yellow
Write-Host "  gcloud run services describe $SERVICE --region $REGION --format='value(status.url)'" -ForegroundColor Yellow
