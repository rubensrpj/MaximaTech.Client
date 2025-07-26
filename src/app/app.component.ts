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
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  produtos$: Observable<Produto[]> = of([]);
  departamentos$: Observable<Departamento[]> = of([]);

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
    this.produtos$ = this.apiService.getProdutosTodos();
    this.produtos$.subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }

  loadDepartments(): void {
    this.departamentos$ = this.apiService.getDepartamentos();
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
      this.productForm.markAllAsTouched();
      return;
    }

    const productData = this.productForm.value;
    console.log(productData);

    const operation$ = this.isEditing
      ? this.apiService.updateProdutos(productData.id, { ...productData, status: true })
      : this.apiService.createProdutos(this.getNewProductData(productData));

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
      this.apiService.deleteProdutos(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
