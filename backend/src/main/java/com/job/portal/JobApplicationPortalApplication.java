package com.job.portal;

import com.job.portal.model.enums.Role;
import com.job.portal.service.interfaces.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

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
	
	@Bean
	public CommandLineRunner seedData(UserService userService) {
		return args -> {
			try {
				// 1. Seed Student: Tanya
				seedUser(userService, "Tanya@gmail.com", "Tanya123", Role.STUDENT);
				
				// 2. Seed Employer: Amazon
				seedUser(userService, "recruiter@amazon.com", "Amazon123", Role.EMPLOYER);
				
			} catch (Exception e) {
				System.err.println("Error seeding data: " + e.getMessage());
			}
		};
	}

	private void seedUser(UserService userService, String email, String password, Role role) {
		try {
			userService.findByEmail(email);
			System.out.println("User already exists: " + email);
		} catch (RuntimeException e) {
			userService.register(email, password, role);
			System.out.println("Seeded user: " + email + " as " + role);
		}
	}

}
