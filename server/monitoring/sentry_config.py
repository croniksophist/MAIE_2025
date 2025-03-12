import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="https://your_sentry_dsn_here@sentry.io/project_id",
    integrations=[
        LoggingIntegration(level="INFO", event_level="ERROR"),
        FastApiIntegration()
    ],
    traces_sample_rate=1.0,
)
