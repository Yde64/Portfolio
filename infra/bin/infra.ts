#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new InfraStack(app, 'PortfolioStack', {
  env: {
    account: '654654246993',
    region: 'us-east-1',
  },
});
