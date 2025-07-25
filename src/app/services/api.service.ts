import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Produto } from '../models/produto.model';
import { Departamento } from '../models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // IMPORTANTE: Altere para a URL da sua API
  private readonly API_BASE_URL = 'https://localhost:5001';

  constructor(private http: HttpClient) { }

  // --- Métodos de Produtos ---

  getProducts(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.API_BASE_URL}/produtos`).pipe(
      catchError(this.handleError)
    );
  }

  getProductById(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.API_BASE_URL}/produtos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(product: Omit<Produto, 'id' | 'status'>): Observable<Produto> {
    return this.http.post<Produto>(`${this.API_BASE_URL}/produtos`, product).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, product: Produto): Observable<void> {
    return this.http.put<void>(`${this.API_BASE_URL}/produtos/${id}`, product).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/produtos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // --- Métodos de Departamentos ---

  getDepartments(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.API_BASE_URL}/departamentos`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // O backend retornou um código de erro
      errorMessage = `Código do erro: ${error.status}, ` + `mensagem: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
