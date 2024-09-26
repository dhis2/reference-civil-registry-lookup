package org.hisp.dhis.integration.camel.route;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.camel.Exchange;
import org.apache.camel.support.DefaultExchange;
import org.hl7.fhir.r4.model.Address;
import org.hl7.fhir.r4.model.ContactPoint;
import org.hl7.fhir.r4.model.Enumerations;
import org.hl7.fhir.r4.model.HumanName;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Person;
import org.hl7.fhir.r4.model.StringType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class FindRouteFunctionalTestCase extends AbstractRouteFunctionalTestCase {
  @LocalServerPort private int serverPort;

  @Autowired private IGenericClient fhirClient;

  @Autowired private ObjectMapper objectMapper;

  @Test
  public void testConfigure() throws JsonProcessingException {

    fhirClient
        .create()
        .resource(
            new Person()
                .setIdentifier(List.of(new Identifier().setValue("328802792660010")))
                .setName(
                    List.of(
                        new HumanName().setFamily("Doe").setGiven(List.of(new StringType("John")))))
                .setGender(Enumerations.AdministrativeGender.MALE)
                .setBirthDate(new Date())
                .setAddress(
                    List.of(
                        new Address()
                            .addLine("HISP Centre")
                            .addLine("University of Oslo")
                            .addLine("Oslo")))
                .setTelecom(List.of(new ContactPoint().setValue("+998 12345678"))))
        .prettyPrint()
        .encodedJson()
        .execute();

    Exchange inExchange = new DefaultExchange(camelContext);
    inExchange.getIn().setHeader(Exchange.CONTENT_TYPE, "application/json");
    inExchange.getIn().setHeader(Exchange.HTTP_METHOD, "POST");
    inExchange.getIn().setBody(objectMapper.writeValueAsString(Map.of("id", "328802792660010")));

    Exchange outExchange =
        producerTemplate.send(
            String.format("http://localhost:%s/api/find", serverPort), inExchange);

    assertEquals(200, outExchange.getMessage().getHeader("CamelHttpResponseCode"));

    Map<String, Object> body =
        objectMapper.readValue(outExchange.getMessage().getBody(String.class), Map.class);
    assertEquals("328802792660010", body.get("id"));
    assertEquals("John", body.get("firstName"));
    assertEquals("Doe", body.get("lastName"));
    assertEquals("male", body.get("sex"));
    assertEquals(new SimpleDateFormat("yyyy-MM-dd").format(new Date()), body.get("dateOfBirth"));
    assertEquals("HISP Centre, University of Oslo, Oslo", body.get("address"));
    assertEquals("+998 12345678", body.get("phone"));
  }
}
