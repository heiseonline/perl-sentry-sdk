package Mojolicious::Plugin::Sentry;
use Mojo::Base 'Mojolicious::Plugin', -signatures;

use Sentry;
use Try::Tiny;

sub register ($self, $app, $conf) {
  $app->hook(
    before_server_start => sub ($server, $app) {
      Sentry->init($conf);
    }
  );


  $app->hook(
    around_action => sub ($next, $c, $action, $last) {
      return unless $last;

      my $req = $c->req;

      Sentry::Hub->get_current_hub()->with_scope(sub($scope) {
        my $transaction = Sentry->start_transaction(
          {
            name => $c->match->endpoint->pattern->unparsed || '/',
            op   => 'http.server',
          },
          {
            request => {
              url     => $req->url->to_string,
              method  => $req->method,
              query   => $req->url->query,
              headers => $req->headers,
            }
          }
        );

        Sentry->configure_scope(sub($scope) {
          $scope->set_span($transaction);
        });

        try {
          $next->();

        }
        catch {
          Sentry->capture_exception($_);
          $c->reply->exception($_)
        }
        finally {
          $transaction->set_http_status($c->res->code);
          $transaction->finish();
        }

      });
    }
  );
}

1;
