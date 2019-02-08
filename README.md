# Portfolio / Resume 
# Find it live at: http://www.cyrusjavan.com/

## Implementation
Developed with NodeJS for the backend and server-side html rendering with Handlebars templates

## Deployment
The node application is containerized with Docker and deployed onto AWS Fargate for easy container management and auto scaling capabilities. The Fargate cluster sits behind the AWS Elastic Load Balancer.

## Logging and Monitoring
The Elastic Load Balancer stores it's acccess logs into an S3 bucket. On my local machine I use Logstash to periodically pull down new logs, filter them, then store them in a local ElasticSearch node. Then using the Kibana web app I can run queries against the log data in ElasticSearch and calculate metrics, or create useful visualizations.


## Future Improvements
* Use TLS so I can have the pretty green lock in Chrome
* Beautify the portfolio page
* Switch to Angular or React for frontend
* Set up CI/CD pipeline
* Add more application level logging
