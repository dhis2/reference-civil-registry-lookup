package org.hisp.dhis.integration.camel;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.context.FhirVersionEnum;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.util.StringUtils;

@SpringBootApplication
public class Application extends SpringBootServletInitializer {
    protected static final Logger LOGGER = LoggerFactory.getLogger(Application.class);

    @Value("${fhir.server-url:}")
    private String fhirServerUrl;

    @Autowired
    private ConfigurableApplicationContext applicationContext;

    @Bean
    public FhirContext fhirContext() {
        return FhirVersionEnum.R4.newContext();
    }

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(Application.class);
        springApplication.run(args);
    }

    @Bean
    public IGenericClient fhirClient(FhirContext fhirContext) {
        if (!StringUtils.hasText(fhirServerUrl)) {
            terminate("Missing FHIR Server URL. Are you sure that you set `fhir.server-url`?");
        }
        return fhirContext.newRestfulGenericClient(fhirServerUrl);
    }


    protected void terminate(String shutdownMessage) {
        LOGGER.error("TERMINATING!!! {}", shutdownMessage);
        applicationContext.close();
        System.exit(1);
    }
}
