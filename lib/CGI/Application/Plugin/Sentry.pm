package CGI::Application::Plugin::Sentry;
use Mojo::Base -base, -signatures;

use CGI::Application;
use Sentry;

# use base 'Exporter';

Sentry->init({dsn => 'fixme', release => '1.0.0', dist => '12345',});

CGI::Application->add_callback(
  init => sub {
    my $c = shift;

    Sentry::Hub->get_current_hub()->push_scope();

    my $transaction = Sentry->start_transaction(
      {name => 'FIXME', op => 'http.server',},
      {
        # request => {
        #   url     => $req->url->to_string,
        #   method  => $req->method,
        #   query   => $req->url->query,
        #   headers => $req->headers,
        # }
      }
    );

    $c->param('__sentry__transaction', $transaction);

    Sentry->configure_scope(sub($scope) {
      $scope->set_span($transaction);
    });
  }
);

CGI::Application->add_callback(
  postrun => sub {
    my $c = shift;

    my $transaction = $c->param('__sentry__transaction');
    $transaction->set_http_status(200);    # FIXME
    $transaction->finish();

    Sentry::Hub->get_current_hub()->pop_scope();
  }
);

1;
