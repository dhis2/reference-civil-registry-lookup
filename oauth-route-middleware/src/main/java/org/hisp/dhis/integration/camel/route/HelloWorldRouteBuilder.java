package org.hisp.dhis.integration.camel.route;

import org.apache.camel.builder.RouteBuilder;
import org.springframework.stereotype.Component;

@Component
public class HelloWorldRouteBuilder extends RouteBuilder {
  @Override
  public void configure() throws Exception {

    from("direct:orgUnits")
        .to("dhis2://get/collection?path=organisationUnits&arrayName=organisationUnits&client=#dhis2Client")
        .marshal()
        .json();
  }
}
