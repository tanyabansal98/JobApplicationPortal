package com.job.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JobApplicationPortalApplication {

	static {
		// Essential: Set this BEFORE the application starts to resolve TNS names from
		// the wallet
		System.setProperty("oracle.net.tns_admin", "/Users/tanyabansal/Downloads/damg6210_wallet");
	}

	public static void main(String[] args) {
		SpringApplication.run(JobApplicationPortalApplication.class, args);
	}

}
