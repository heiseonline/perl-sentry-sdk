package Mojolicious::Plugin::SentrySDK;
use Mojo::Base 'Mojolicious::Plugin', -signatures;

use Mojolicious;
use Sentry::SDK;
use Try::Tiny;

sub register ($self, $app, $conf) {
  $app->hook(
    before_server_start => sub ($server, $app) {
      Sentry::SDK->init($conf);
    }
  );

  $app->hook(
    around_action => sub ($next, $c, $action, $last) {
      return $next->() unless $last;

      my $req = $c->req;

      Sentry::Hub->get_current_hub()->with_scope(sub ($scope) {
        my %cookies = map { ($_->name, $_->value) } ($req->cookies // [])->@*;
        my $transaction_name = $c->match->endpoint->to_string || '/';
        $scope->set_transaction_name($transaction_name);
        my $transaction = Sentry::SDK->start_transaction(
          {
            name    => $transaction_name,
            op      => 'http.server',
            request => {
              url          => $req->url->to_abs->to_string,
              cookies      => \%cookies,
              method       => $req->method,
              query_string => $req->url->query->to_hash,
              headers      => $req->headers->to_hash,
              env          => \%ENV,
            },
          },
        );
        $scope->set_span($transaction);

        $scope->add_event_processor(
          sub ($event, $hint) {
            my $modules = $event->{modules} //= {};
            $modules->{Mojolicious} = $Mojolicious::VERSION;
            return $event;
          }
        );

        try {
          $next->();
        } catch {
          Sentry::SDK->capture_exception($_);
          $c->reply->exception($_)
        } finally {
          my $status = $c->res->code;
          $transaction->set_http_status($status) if $status;
          $transaction->finish();
        };
      });
    }
  );
}

1;

=encoding utf8

=head1 NAME

Mojolicious::Plugin::SentrySDK - Sentry plugin for Mojolicious

=head1 SYNOPSIS

=head1 DESCRIPTION

=head1 OPTIONS

=head2 register

  my $config = $plugin->register(Mojolicious->new);
  my $config = $plugin->register(Mojolicious->new, \%options);

Register Sentry in L<Mojolicious> application.

=head1 SEE ALSO

L<Sentry::SDK>.

=cut
