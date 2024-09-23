package org.hisp.dhis.integration.camel.route;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.server.LocalServerPort;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class HelloWorldRouteBuilderFunctionalTestCase extends AbstractRouteFunctionalTestCase {
  @LocalServerPort private int serverPort;

  @Test
  public void testConfigure() {
    Exchange exchange =
        producerTemplate.request(
            String.format("http://localhost:%s/api/orgUnits", serverPort), e -> {});

    assertEquals(200, exchange.getMessage().getHeader("CamelHttpResponseCode"));
    assertNotNull(exchange.getMessage().getBody(String.class));
  }
}
