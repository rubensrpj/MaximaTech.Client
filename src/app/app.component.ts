import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { ApiService } from './services/api.service';
import { Produto } from './models/produto.model';
import { Departamento } from './models/departamento.model';

registerLocaleData(localePt);

@Component({
  selector: 'app-root',
  standalone: true, // Define o componente como autônomo
  imports: [
    CommonModule, // Necessário para diretivas como *ngIf, *ngFor e pipes (async, currency)
    ReactiveFormsModule // Necessário para formulários reativos
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  produtos$: Observable<Produto[]> = of([]); // Inicializado para evitar o erro TS2564
  departamentos$: Observable<Departamento[]> = of([]); // Inicializado para evitar o erro TS2564

  productForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    // Inicializa o formulário reativo
    this.productForm = this.fb.group({
      id: [null],
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      departamentoId: [null, Validators.required],
      preco: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadDepartments();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.produtos$ = this.apiService.getProducts();
    this.produtos$.subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }

  loadDepartments(): void {
    this.departamentos$ = this.apiService.getDepartments();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.productForm.reset({ preco: 0, departamentoId: null }); // Reseta o formulário
    this.isModalOpen = true;
  }

  openEditModal(product: Produto): void {
    this.isEditing = true;
    this.productForm.setValue({
      id: product.id,
      codigo: product.codigo,
      descricao: product.descricao,
      departamentoId: product.departamentoId,
      preco: product.preco
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); // Marca campos como tocados para exibir erros
      return;
    }

    const productData = this.productForm.value;
    console.log(productData);

    const operation$ = this.isEditing
      ? this.apiService.updateProduct(productData.id, { ...productData, status: true })
      : this.apiService.createProduct(this.getNewProductData(productData));

    // CORREÇÃO: Adicionado 'as Observable<any>' para resolver o conflito de tipos.
    (operation$ as Observable<any>).subscribe(() => {
      this.loadProducts();
      this.closeModal();
    });
  }

  private getNewProductData(productData: any) {
    const { id, ...newProductData } = productData;
    return newProductData;
  }

  onDelete(id: string): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.apiService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
