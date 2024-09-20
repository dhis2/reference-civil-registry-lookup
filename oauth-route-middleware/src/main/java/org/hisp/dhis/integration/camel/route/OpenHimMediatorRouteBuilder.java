package org.hisp.dhis.integration.camel.route;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.http.HttpMethods;
import org.hisp.dhis.integration.camel.UptimeExpression;
import org.hisp.dhis.integration.camel.security.SelfSignedHttpClientConfigurer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OpenHimMediatorRouteBuilder extends RouteBuilder {

  @Autowired private UptimeExpression uptime;

  @Override
  public void configure() throws Exception {
    //FIXME: remove this line and all references to `selfSignedHttpClientConfigurer` once
    // default self-signed TLS certificate returned by OpenHIM core is replaced with a certifcate issued by a CA.
    getContext()
        .getRegistry()
        .bind("selfSignedHttpClientConfigurer", new SelfSignedHttpClientConfigurer());

    from("timer://registerOpenHimMediator?repeatCount=1")
        .id("openHimRegisterRoute")
        .transform(
            datasonnet(
                "resource:classpath:openhim/mediator-config.ds",
                String.class,
                "application/x-java-object",
                "application/json"))
        .setHeader(Exchange.HTTP_METHOD, constant(HttpMethods.POST))
        .toD("{{openhim.url}}/mediators?httpClientConfigurer=#selfSignedHttpClientConfigurer&authUsername={{openhim.username}}&authPassword={{openhim.password}}&authenticationPreemptive=true");

    from("timer://heartbeatOpenHimMediator?delay=10000&fixedRate=true&period=5000")
        .id("openHimHeartbeatRoute")
        .setProperty("uptime", uptime)
        .transform(
            datasonnet(
                "resource:classpath:openhim/heartbeat.ds",
                String.class,
                "application/x-java-object",
                "application/json"))
        .setHeader(Exchange.HTTP_METHOD, constant(HttpMethods.POST))
        .toD("{{openhim.url}}/mediators/urn:mediator:oauth-route-middleware/heartbeat?httpClientConfigurer=#selfSignedHttpClientConfigurer&authUsername={{openhim.username}}&authPassword={{openhim.password}}&authenticationPreemptive=true");
  }
}
