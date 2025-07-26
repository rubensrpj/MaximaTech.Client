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
  private readonly API_BASE_URL = 'https://localhost:5001';

  constructor(private http: HttpClient) { }

  getProdutosTodos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.API_BASE_URL}/produtos`).pipe(
      catchError(this.handleError)
    );
  }

  getProdutosPorId(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.API_BASE_URL}/produtos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createProdutos(product: Omit<Produto, 'id' | 'status'>): Observable<Produto> {
    return this.http.post<Produto>(`${this.API_BASE_URL}/produtos`, product).pipe(
      catchError(this.handleError)
    );
  }

  updateProdutos(id: string, product: Produto): Observable<void> {
    return this.http.put<void>(`${this.API_BASE_URL}/produtos/${id}`, product).pipe(
      catchError(this.handleError)
    );
  }

  deleteProdutos(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/produtos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.API_BASE_URL}/departamentos`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código do erro: ${error.status}, ` + `mensagem: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
