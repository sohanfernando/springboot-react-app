package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.io.File;
import java.nio.file.Files;
import java.util.List;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(BackendApplication.class, args);
    }

    /**
     * Local development only. The file lives beside pom.xml, deliberately
     * outside src/main/resources: anything in there is copied into the jar,
     * which would ship the secrets with the build. In production there is no
     * file and real environment variables are used instead.
     */
    private static void loadDotEnv() {
        // Started from backend/ (mvnw) or from the repository root (some IDEs).
        File envFile = new File(".env");
        if (!envFile.exists()) {
            envFile = new File("backend/.env");
        }
        if (envFile.exists()) {
            try {
                List<String> lines = Files.readAllLines(envFile.toPath());
                for (String line : lines) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    int eqIdx = line.indexOf('=');
                    if (eqIdx > 0) {
                        String key = line.substring(0, eqIdx).trim();
                        String value = line.substring(eqIdx + 1).trim();
                        // Strip quotes if present
                        if (value.startsWith("\"") && value.endsWith("\"")) {
                            value = value.substring(1, value.length() - 1);
                        } else if (value.startsWith("'") && value.endsWith("'")) {
                            value = value.substring(1, value.length() - 1);
                        }
                        // A blank entry means "not set", so the default applies.
                        if (!value.isEmpty()) {
                            System.setProperty(key, value);
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to load .env file: " + e.getMessage());
            }
        }
    }
}
