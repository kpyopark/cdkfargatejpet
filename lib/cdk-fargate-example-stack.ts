import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";

export class CdkFargateExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, "FargateTestVpc", {
      maxAzs: 3, // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "FargateSpringCluster", {
      vpc: vpc,
    });

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "SpringJpetstoreService",
      {
        cluster: cluster, // Required
        cpu: 512, // Default is 256
        desiredCount: 6, // Default is 1
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("jpetstore-sample"),
          containerPort: 8080,
        },
        memoryLimitMiB: 2048, // Default is 512
        publicLoadBalancer: true, // Default is false
      }
    );
  }
}
