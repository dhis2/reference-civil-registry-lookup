package org.hisp.dhis.integration.camel.security;

import org.apache.camel.component.http.HttpClientConfigurer;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.stereotype.Component;

import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

@Component
public class SelfSignedHttpClientConfigurer implements HttpClientConfigurer {
    @Override
    public void configureHttpClient(HttpClientBuilder clientBuilder) {
        try {
            final SSLContext sslContext = new SSLContextBuilder()
                    .loadTrustMaterial(null, (x509CertChain, authType) -> true).build();

            clientBuilder
                    .setConnectionManager(new PoolingHttpClientConnectionManager(org.apache.hc.core5.http.config.RegistryBuilder
                            .<org.apache.hc.client5.http.socket.ConnectionSocketFactory>create().register("http", org.apache.hc.client5.http.socket.PlainConnectionSocketFactory.INSTANCE)
                            .register("https",
                                    new org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE))
                            .build()));

        } catch (KeyManagementException | NoSuchAlgorithmException | KeyStoreException e) {
            throw new RuntimeException(e);
        }
    }
}