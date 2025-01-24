class ImageEditor {
    constructor() {
      this.initializeElements();
      this.setupEventListeners();
      this.resetFilters();
    }
  
    initializeElements() {
      
      this.fileInput = document.querySelector('.file-input');
      this.previewImage = document.querySelector('.preview-image');
      this.dropZone = document.querySelector('.drop-zone');
      
      
      this.filterButtons = document.querySelectorAll('.filter-buttons button');
      this.filterSlider = document.querySelector('.slider');
      this.filterName = document.querySelector('.filter-info .name');
      this.filterValue = document.querySelector('.filter-info .value');
      
      
      this.transformButtons = document.querySelectorAll('.transform-buttons button');
      
      
      this.resetButton = document.querySelector('.reset-filters');
      this.saveButton = document.querySelector('.save-image');
  
      
      this.filters = {
        brightness: 100,
        saturation: 100,
        inversion: 0,
        grayscale: 0
      };
  
      this.transformations = {
        rotate: 0,
        flipHorizontal: 1,
        flipVertical: 1
      };
    }
  
    setupEventListeners() {
      
      this.fileInput.addEventListener('change', this.loadImage.bind(this));
      this.dropZone.addEventListener('click', () => this.fileInput.click());
      this.dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
      this.dropZone.addEventListener('drop', this.handleFileDrop.bind(this));
  
      
      this.filterButtons.forEach(button => {
        button.addEventListener('click', () => this.selectFilter(button));
      });
  
      
      this.filterSlider.addEventListener('input', this.updateFilter.bind(this));
  
      
      this.transformButtons.forEach(button => {
        button.addEventListener('click', () => this.transformImage(button.id));
      });
  
      
      this.resetButton.addEventListener('click', this.resetAll.bind(this));
      this.saveButton.addEventListener('click', this.saveImage.bind(this));
    }
  
    loadImage(event) {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage.src = e.target.result;
        this.previewImage.onload = () => {
          this.resetAll();
          this.dropZone.style.opacity = '0';
        };
      };
      reader.readAsDataURL(file);
    }
  
    handleDragOver(event) {
      event.preventDefault();
      event.stopPropagation();
      this.dropZone.style.opacity = '1';
    }
  
    handleFileDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer.files;
      this.fileInput.files = files;
      this.loadImage({ target: { files } });
    }
  
    selectFilter(button) {
      this.filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      this.filterName.textContent = button.textContent;
      const filterId = button.id;
  
      const filterSettings = {
        brightness: { max: 200, value: this.filters.brightness },
        saturation: { max: 200, value: this.filters.saturation },
        inversion: { max: 100, value: this.filters.inversion },
        grayscale: { max: 100, value: this.filters.grayscale }
      };
  
      const setting = filterSettings[filterId];
      this.filterSlider.max = setting.max;
      this.filterSlider.value = setting.value;
      this.filterValue.textContent = `${setting.value}%`;
    }
  
    updateFilter() {
      const selectedFilter = document.querySelector('.filter-buttons button.active').id;
      const value = this.filterSlider.value;
  
      this.filterValue.textContent = `${value}%`;
      this.filters[selectedFilter] = value;
      this.applyFilters();
    }
  
    transformImage(action) {
      switch (action) {
        case 'rotate-left':
          this.transformations.rotate -= 90;
          break;
        case 'rotate-right':
          this.transformations.rotate += 90;
          break;
        case 'flip-horizontal':
          this.transformations.flipHorizontal *= -1;
          break;
        case 'flip-vertical':
          this.transformations.flipVertical *= -1;
          break;
      }
      this.applyFilters();
    }
  
    applyFilters() {
      const { brightness, saturation, inversion, grayscale } = this.filters;
      const { rotate, flipHorizontal, flipVertical } = this.transformations;
  
      this.previewImage.style.filter = `
        brightness(${brightness}%) 
        saturate(${saturation}%) 
        invert(${inversion}%) 
        grayscale(${grayscale}%)
      `;
  
      this.previewImage.style.transform = `
        rotate(${rotate}deg) 
        scaleX(${flipHorizontal}) 
        scaleY(${flipVertical})
      `;
    }
  
    resetFilters() {
      this.filters = {
        brightness: 100,
        saturation: 100,
        inversion: 0,
        grayscale: 0
      };
      this.filterButtons[0].click();
      this.applyFilters();
    }
  
    resetAll() {
      this.resetFilters();
      this.transformations = {
        rotate: 0,
        flipHorizontal: 1,
        flipVertical: 1
      };
      this.applyFilters();
    }
  
    saveImage() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const { naturalWidth, naturalHeight } = this.previewImage;
  
      canvas.width = naturalWidth;
      canvas.height = naturalHeight;
  
      ctx.filter = `
        brightness(${this.filters.brightness}%) 
        saturate(${this.filters.saturation}%) 
        invert(${this.filters.inversion}%) 
        grayscale(${this.filters.grayscale}%)
      `;
  
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(this.transformations.rotate * Math.PI / 180);
      ctx.scale(this.transformations.flipHorizontal, this.transformations.flipVertical);
      ctx.drawImage(
        this.previewImage, 
        -canvas.width / 2, 
        -canvas.height / 2, 
        canvas.width, 
        canvas.height
      );
      ctx.restore();
  
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    new ImageEditor();
  });