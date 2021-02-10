# NAME

Sentry::SDK - sentry.io integration

# SYNOPSIS

    use Sentry::SDK;

    Sentry::SDK->init({
      dsn => "https://examplePublicKey@o0.ingest.sentry.io/0",

      # Adjusting this value in production
      traces_sample_rate => 1.0,
    });

# DESCRIPTION

# FUNCTIONS

## init

    Sentry::SDK->init(\%options);

Initializes the Sentry SDK in your app. The following options are provided:

### dsn

The DSN tells the SDK where to send the events. If this value is not provided, the SDK will try to read it from the `SENTRY_DSN` environment variable. If that variable also does not exist, the SDK will just not send any events.

### release

Sets the release. Defaults to the `SENTRY_RELEASE` environment variable.

### environment

Sets the environment. This string is freeform and not set by default. A release can be associated with more than one environment to separate them in the UI (think staging vs prod or similar).

By default the SDK will try to read this value from the `SENTRY_ENVIRONMENT` environment variable.

### traces\_sample\_rate

A number between 0 and 1, controlling the percentage chance a given transaction will be sent to Sentry. (0 represents 0% while 1 represents 100%.) Applies equally to all transactions created in the app. This must be defined to enable tracing.

### integrations

    Sentry::SDK->init({
      integrations => [My::Integration->new],
    });

Enables your custom integration. Optional.

### default\_integrations

This can be used to disable integrations that are added by default. When set to a falsy value, no default integrations are added.

## add\_breadcrumb

    Sentry::SDK->add_breadcrumb({
      category => "auth",
      message => "Authenticated user " . user->{email},
      level => Sentry::Severity->Info,
    });

You can manually add breadcrumbs whenever something interesting happens. For example, you might manually record a breadcrumb if the user authenticates or another state change happens.

## capture\_exception

    eval {
      $app->run();
    };
    if ($@) {
      Sentry::SDK->capture_exception($@);
    }

You can pass an error object to capture\_exception() to get it captured as event. It's possible to throw strings as errors.

## capture\_message

    Sentry::SDK->capture_message("Something went wrong");

Another common operation is to capture a bare message. A message is textual information that should be sent to Sentry. Typically messages are not emitted, but they can be useful for some teams.

## capture\_event

    Sentry::SDK->capture_event(\%data);

Captures a manually created event and sends it to Sentry.

## configure\_scope

    Sentry::SDK->configure_scope(sub ($scope) {
      $scope->set_tag(foo => "bar");
      $scope->set-user({id => 1, email => "john.doe@example.com"});
    });

When an event is captured and sent to Sentry, event data with extra information will be merged from the current scope. The `configure_scope` function can be used to reconfigure the current scope. This for instance can be used to add custom tags or to inform sentry about the currently authenticated user. See [Sentry::Hub::Scope](https://metacpan.org/pod/Sentry%3A%3AHub%3A%3AScope) for further information.

## start\_transaction

    my $transaction = Sentry::SDK->start_transaction({
      name => 'MyScript',
      op => 'http.server',
    });

    Sentry::SDK->configure_scope(sub ($scope) {
      $scope->set_span($transaction);
    });

    # ...

    $transaction->set_http_status(200);
    $transaction->finish();

Is needed for recording tracing information. Transactions are usually handled by the respective framework integration. See [Sentry::Tracing::Transaction](https://metacpan.org/pod/Sentry%3A%3ATracing%3A%3ATransaction).

# AUTHOR

Philipp Busse <pmb@heise.de>

# COPYRIGHT

Copyright 2021- Philipp Busse

# LICENSE

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

# SEE ALSO
