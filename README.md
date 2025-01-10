# Fulcrum Devops

A simple Node.js backend with a React frontend, dockerized and deployed using CI/CD on AWS ECS with CloudWatch monitoring.

## CI/CD Workflow Steps

1. **Trigger**: Workflow runs on pushes to `main` branch.
2. **Checkout**: Code is checked out from the repository.
3. **Setup Node.js**: Node.js environment is prepared.
4. **Install Dependencies**: Both backend and frontend dependencies are installed.
5. **Run Tests**: Tests are executed for backend and frontend.
6. **Build Docker Images**: Docker images are built for both services.
7. **Login to Amazon ECR**: Authenticate with AWS ECR.
8. **Tag & Push Images**: Images are tagged and pushed to ECR.
9. **Deploy to ECS**: New task definitions are deployed to AWS ECS services.

## Deployment Instructions

1. **Ensure AWS CLI Configuration**: Make sure AWS CLI is set up with appropriate credentials.
2. **Update ECS Service**: Use the command:
   ```bash
   aws ecs update-service --cluster DevCluster --service backend-service --task-definition arn:aws:ecs:us-east-1:211125439791:task-definition/backend:1 --force-new-deployment
   aws ecs update-service --cluster DevCluster --service frontend-service --task-definition arn:aws:ecs:us-east-1:211125439791:task-definition/frontend:1 --force-new-deployment

## Monitoring
#### AWS CloudWatch: 
- Logs: Check logs under /ecs/backend and /ecs/frontend log groups.
- Metrics: Monitor ECS service metrics like CPU, memory usage, and health checks.
- Alarms: Set up alarms for critical metrics or log patterns.

## Contributing
Open issues or submit pull requests for enhancements or fixes.

## 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
