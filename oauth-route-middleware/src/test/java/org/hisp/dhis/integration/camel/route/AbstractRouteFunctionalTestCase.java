package org.hisp.dhis.integration.camel.route;

import org.apache.camel.CamelContext;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.test.spring.junit5.CamelSpringBootTest;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.HttpWaitStrategy;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.utility.DockerImageName;

import java.time.Duration;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@CamelSpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class AbstractRouteFunctionalTestCase {

  @Container public static GenericContainer<?> HAPI_FHIR_CONTAINER;

  @Autowired protected CamelContext camelContext;

  @Autowired protected ProducerTemplate producerTemplate;

  private static GenericContainer<?> newHapiFhirContainer() {
    return new GenericContainer<>(DockerImageName.parse("hapiproject/hapi:v7.4.0-tomcat"))
        .withExposedPorts(8080)
        .waitingFor(
            new HttpWaitStrategy().forStatusCode(200).withStartupTimeout(Duration.ofSeconds(120)));
  }

  @BeforeAll
  public static void beforeAll() throws Exception {
    if (HAPI_FHIR_CONTAINER == null) {
      HAPI_FHIR_CONTAINER = newHapiFhirContainer();
      HAPI_FHIR_CONTAINER.start();

      System.setProperty(
          "fhir.server-url", String.format("http://localhost:%s/fhir", HAPI_FHIR_CONTAINER.getFirstMappedPort()));
    }
  }
}
