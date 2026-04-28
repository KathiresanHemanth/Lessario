#include <stdio.h>

int main() {
    int marks[5];
    float total = 0, average;
    char grade;
    
    printf("=== Grade Management System ===\n");
    printf("Enter marks for 5 subjects (0-100):\n");
    
    // Input marks
    for(int i = 0; i < 5; i++) {
        printf("Subject %d: ", i + 1);
        scanf("%d", &marks[i]);
        total += marks[i];
    }
    
    // Calculate average
    average = total / 5;
    
    // Determine grade
    if(average >= 90) {
        grade = 'A';
    } else if(average >= 80) {
        grade = 'B';
    } else if(average >= 70) {
        grade = 'C';
    } else if(average >= 60) {
        grade = 'D';
    } else {
        grade = 'F';
    }
    
    // Display results
    printf("\n--- Results ---\n");
    printf("Total Marks: %.0f\n", total);
    printf("Average: %.2f\n", average);
    printf("Grade: %c\n", grade);
    
    system("pause");
    return 0;
}
