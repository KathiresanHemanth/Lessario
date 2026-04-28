#include <stdio.h>
#include <stdlib.h>

int main() {
    int num1, num2, result;
    char operation;
    
    printf("=== Simple Calculator ===\n");
    printf("Enter first number: ");
    scanf("%d", &num1);
    printf("Enter operator (+, -, *, /): ");
    scanf(" %c", &operation);
    
    printf("Enter second number: ");
    scanf("%d", &num2);
    
    if(operation == '+') {
        result = num1 + num2;
        printf("%d + %d = %d\n", num1, num2, result);
    } 
    else if(operation == '-') {
        result = num1 - num2;
        printf("%d - %d = %d\n", num1, num2, result);
    }
    else if(operation == '*') {
        result = num1 * num2;
        printf("%d * %d = %d\n", num1, num2, result);
    }
    else if(operation == '/') {
        if(num2 != 0) {
            result = num1 / num2;
            printf("%d / %d = %d\n", num1, num2, result);
        } else {
            printf("ERROR: Cannot divide by zero!\n");
        }
    }
    else {
        printf("Invalid operator!\n");
    }
    
    system("pause");
    return 0;
}