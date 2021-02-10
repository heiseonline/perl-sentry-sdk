package CGI::Application::Plugin::Sentry;
use Mojo::Base -base, -signatures;

use CGI::Application;
use HTTP::Status ':constants';
use Mojo::Util 'dumper';
use Sentry::SDK;

CGI::Application->add_callback(
  init => sub ($c, @args) {
    my $options = $c->param('sentry_options');
    Sentry::SDK->init($options);

    Sentry::SDK->configure_scope(sub ($scope) {
      $scope->set_tags({
        runtime => "Perl $]",
        url     => $c->query->url(-full => 1, -path => 1, -query => 1),
      });
    });
  }
);

CGI::Application->add_callback(
  error => sub ($c, $error) {
    Sentry::SDK->capture_exception($error);
  }
);

CGI::Application->add_callback(
  prerun => sub ($c, $rm) {
    Sentry::Hub->get_current_hub()->push_scope();

    Sentry::SDK->configure_scope(sub ($scope) {
      $scope->add_breadcrumb({ message => 'prerun' });
    });

    my $method      = $c->query->request_method;
    my $transaction = Sentry::SDK->start_transaction(
      { name => "$method $rm", op => 'http.server', },
      {
        request => {
          url     => $c->query->url(-full => 1, -path => 1, -query => 1),
          method  => $method,
          query   => { $c->query->Vars },
          headers => { map { $_ => $c->query->http($_) } $c->query->http },
          env     => \%ENV,
        }
      }
    );

    $c->param('__sentry__transaction', $transaction);

    Sentry::SDK->configure_scope(sub ($scope) {
      $scope->set_span($transaction);
    });
  }
);

CGI::Application->add_callback(
  postrun => sub ($c, $body_ref) {
    Sentry::SDK->configure_scope(sub ($scope) {
      $scope->add_breadcrumb({ message => 'postrun' });
    });

    my $transaction = $c->param('__sentry__transaction');
    # Does anyone know how to get the HTTP respnose status code using $c?
    $transaction->set_http_status(HTTP_OK);
    $transaction->finish();
  }
);

CGI::Application->add_callback(
  teardown => sub ($c) {
    Sentry::Hub->get_current_hub()->pop_scope();
  }
);

1;

=encoding utf8

=head1 NAME

CGI::Application::Plugin::Sentry - Sentry plugin for CGI::Application

=head1 SYNOPSIS

=head1 DESCRIPTION

=head1 OPTIONS

=head1 METHODS

=head1 SEE ALSO

L<Sentry::SDK>.

=cut
