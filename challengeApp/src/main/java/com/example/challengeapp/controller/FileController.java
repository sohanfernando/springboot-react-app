package com.example.challengeapp.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads/products")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            String workingDir = System.getProperty("user.dir");
            System.out.println("Working directory: " + workingDir);
            Path file = Paths.get(workingDir, "uploads", "products").resolve(filename).normalize();
            System.out.println("Trying to serve: " + file.toAbsolutePath());
            System.out.println("File exists: " + java.nio.file.Files.exists(file));
            System.out.println("File is readable: " + java.nio.file.Files.isReadable(file));
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                System.out.println("File not found or not readable: " + file.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            System.out.println("Malformed URL: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
} 