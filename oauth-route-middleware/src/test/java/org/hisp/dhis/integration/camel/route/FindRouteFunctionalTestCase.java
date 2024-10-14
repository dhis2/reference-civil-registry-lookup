/*
 *  Copyright (c) 2004-2024, University of Oslo
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *  Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *
 *  Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation
 *  and/or other materials provided with the distribution.
 *  Neither the name of the HISP project nor the names of its contributors may
 *  be used to endorse or promote products derived from this software without
 *  specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 *  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 *  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package org.hisp.dhis.integration.camel.route;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.support.DefaultExchange;
import org.apache.camel.test.spring.junit5.UseAdviceWith;
import org.hl7.fhir.r4.model.Address;
import org.hl7.fhir.r4.model.ContactPoint;
import org.hl7.fhir.r4.model.Enumerations;
import org.hl7.fhir.r4.model.HumanName;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Person;
import org.hl7.fhir.r4.model.StringType;
import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import com.fasterxml.jackson.databind.ObjectMapper;

@UseAdviceWith
public class FindRouteFunctionalTestCase extends AbstractRouteFunctionalTestCase {
  @LocalServerPort private int serverPort;

  @Autowired private CamelContext camelContext;

  @Autowired private ObjectMapper objectMapper;

  private CamelContext identityProviderCamelContext;

  @BeforeEach
  public void beforeEach() throws Exception {
    identityProviderCamelContext = mockIdentityProvider();
    identityProviderCamelContext.start();
    camelContext.start();
  }

  @AfterEach
  public void afterEach() throws Exception {
    identityProviderCamelContext.close();
  }

  private CamelContext mockIdentityProvider() throws Exception {
    CamelContext identityProviderCamelContext = new DefaultCamelContext(false);
    identityProviderCamelContext.addRoutes(
            new RouteBuilder() {
              @Override
              public void configure() {
                from("jetty:" + identityProviderUrl)
                        .process(
                                exchange -> {
                                  assertEquals(
                                          "Basic Y2l2aWwtcmVnaXN0cnktY2xpZW50OmliejJsRVhkR2UwMkNKUzJON3RZMTNyNjY2NGVKcG9Y",
                                          exchange.getMessage().getHeader("Authorization"));
                                  assertEquals(
                                          "grant_type=client_credentials",
                                          exchange.getMessage().getBody(String.class));
                                })
                        .setBody(
                                (Function<Exchange, Object>)
                                        exchange ->
                                                Map.of(
                                                        "access_token",
                                                        "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzOGZSMXNmQzlQb0IxTlcyTTRHUnN4d1UzdUZfYmNjUGNseWt2WVU5c2pRIn0.eyJleHAiOjE3MjczNDg0MTMsImlhdCI6MTcyNzM0ODExMywianRpIjoiN2E4OWQxYWQtOWY4OS00ZDVhLWI4MWItNDU1NjRkZDNjMTNjIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrOjgwODAvcmVhbG1zL2NpdmlsLXJlZ2lzdHJ5IiwiYXVkIjpbImFjY291bnQiLCJjaXZpbC1yZWdpc3RyeS1jbGllbnQiXSwic3ViIjoiY2Y4NmFkY2QtMzIyNi00MWZmLThjY2EtMWJiM2FjNzUyOGM5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY2l2aWwtcmVnaXN0cnktY2xpZW50IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1jaXZpbC1yZWdpc3RyeSIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRIb3N0IjoiMTkyLjE2OC45Ni4xIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtY2l2aWwtcmVnaXN0cnktY2xpZW50IiwiY2xpZW50QWRkcmVzcyI6IjE5Mi4xNjguOTYuMSIsImNsaWVudF9pZCI6ImNpdmlsLXJlZ2lzdHJ5LWNsaWVudCJ9.MYcQDPNz7Z4URYcLOH3v60bNxkqJlyWvYPWIBWp_VYKKZrmTXH2nvG3hPkF8aTHT2P-Kom5iQSwrZz519WB16X-qVYCdvqnCQY1poRITnAXOsjF3I1Ymli29vWdKJvkn7aXmEYn54c00VvfyjCfKbjOweKa-UdIXjfcO8hATP7neo-UiNQ6a7-Sj2TEwGDBFc989Sj40JjIVh6G6rH2h5zte8mxZy1RZUhXDp3DppHZB0ddfrk5rkECLITfsAg6pzyHmzaPYOq8kSRis59yzKgWCXurkq4WOw9-Rz7oNIc1CfPan_8YvYtsnYUG35Rh44UU6cWJnyv1sDIgyUHPIZw",
                                                        "expires_in",
                                                        300,
                                                        "refresh_expires_in",
                                                        0,
                                                        "token_type",
                                                        "Bearer",
                                                        "not-before-policy",
                                                        0,
                                                        "scope",
                                                        "email profile"))
                        .marshal()
                        .json();
              }
            });

    return identityProviderCamelContext;
  }

  @Test
  public void testFindRouteGivenKnownPersonIdentifier() throws Exception {
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
    assertEquals("MALE", body.get("sex"));
    assertEquals(new SimpleDateFormat("yyyy-MM-dd").format(new Date()), body.get("dateOfBirth"));
    assertEquals("HISP Centre, University of Oslo, Oslo", body.get("address"));
    assertEquals("+998 12345678", body.get("phone"));
  }

  @Test
  public void testFindRouteGivenUnknownPersonIdentifier() throws Exception {
    Exchange inExchange = new DefaultExchange(camelContext);
    inExchange.getIn().setHeader(Exchange.CONTENT_TYPE, "application/json");
    inExchange.getIn().setHeader(Exchange.HTTP_METHOD, "POST");
    inExchange.getIn().setBody(objectMapper.writeValueAsString(Map.of("id", "328802792660011")));

    Exchange outExchange =
            producerTemplate.send(
                    String.format("http://localhost:%s/api/find?okStatusCodeRange=200-500", serverPort), inExchange);

    assertEquals(404, outExchange.getMessage().getHeader("CamelHttpResponseCode"));
    assertEquals("Person not found", outExchange.getMessage().getBody(String.class));
  }
}
