package org.hisp.dhis.integration.camel.route;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.camel.builder.AdviceWith;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.model.ToDynamicDefinition;
import org.apache.camel.test.spring.junit5.UseAdviceWith;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@UseAdviceWith
public class OpenHimMediatorRouteBuilderTestCase extends AbstractRouteFunctionalTestCase {

    @Value("classpath:openhim/mediator-config.ds")
    private Resource mediatorConfigResource;

    @Autowired private ObjectMapper objectMapper;

    @Test
    public void testRegisterMediatorRoute() throws Exception {
        AdviceWith.adviceWith(
                camelContext,
                "openHimRegisterRoute",
                a -> a.weaveByType(ToDynamicDefinition.class).replace().to("mock:register"));

        MockEndpoint endpoint = camelContext.getEndpoint("mock:register", MockEndpoint.class);
        endpoint.setExpectedCount(1);

        camelContext.start();

        endpoint.await(5, TimeUnit.SECONDS);
        assertEquals(1, endpoint.getReceivedCounter());
        Map mediatorConfig =
                objectMapper.readValue(
                        endpoint.getReceivedExchanges().get(0).getMessage().getBody(String.class), Map.class);
        assertEquals(
                objectMapper.readValue(
                        mediatorConfigResource.getContentAsString(StandardCharsets.UTF_8), Map.class),
                mediatorConfig);
    }

    @Test
    public void testHeartbeatRoute() throws Exception {
        AdviceWith.adviceWith(
                camelContext,
                "openHimHeartbeatRoute",
                a -> a.weaveByType(ToDynamicDefinition.class).replace().to("mock:heartbeat"));

        MockEndpoint endpoint = camelContext.getEndpoint("mock:heartbeat", MockEndpoint.class);
        endpoint.setExpectedCount(1);

        camelContext.start();

        endpoint.await(20, TimeUnit.SECONDS);
        assertEquals(1, endpoint.getReceivedCounter());
        Map heartbeat =
                objectMapper.readValue(
                        endpoint.getReceivedExchanges().get(0).getMessage().getBody(String.class), Map.class);
        assertNotNull(heartbeat.get("uptime"));
    }
}
