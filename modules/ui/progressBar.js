// progressBar.js - プログレスバーコンポーネント

export class ProgressBar {
  constructor(containerId, totalSteps) {
    this.container = document.getElementById(containerId);
    this.totalSteps = totalSteps;
    this.currentStep = 0;
    this.init();
  }

  init() {
    this.createProgressBar();
    this.updateProgress(0);
  }

  createProgressBar() {
    // プログレスバーのメインコンテナ
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    // プログレスバーの背景
    const progressTrack = document.createElement('div');
    progressTrack.className = 'progress-track';
    
    // プログレスバーのフィル部分
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressFill.id = 'progress-fill';
    
    // ステップインジケーター
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'steps-container';
    
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepDot = document.createElement('div');
      stepDot.className = 'step-dot';
      stepDot.dataset.step = i;
      stepDot.textContent = i;
      stepsContainer.appendChild(stepDot);
    }
    
    // ステップラベル
    const stepLabel = document.createElement('div');
    stepLabel.className = 'step-label';
    stepLabel.id = 'step-label';
    stepLabel.textContent = 'ステップ 0 / ' + this.totalSteps;
    
    // 組み立て
    progressTrack.appendChild(progressFill);
    progressContainer.appendChild(stepLabel);
    progressContainer.appendChild(progressTrack);
    progressContainer.appendChild(stepsContainer);
    
    this.container.appendChild(progressContainer);
  }

  updateProgress(stepNumber) {
    this.currentStep = stepNumber;
    
    // プログレスバーの更新
    const progressFill = document.getElementById('progress-fill');
    const percentage = (stepNumber / this.totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;
    
    // ステップラベルの更新
    const stepLabel = document.getElementById('step-label');
    stepLabel.textContent = `ステップ ${stepNumber} / ${this.totalSteps}`;
    
    // ステップドットの更新
    const stepDots = document.querySelectorAll('.step-dot');
    stepDots.forEach((dot, index) => {
      const dotStep = index + 1;
      dot.classList.remove('completed', 'current');
      
      if (dotStep < stepNumber) {
        dot.classList.add('completed');
      } else if (dotStep === stepNumber) {
        dot.classList.add('current');
      }
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.updateProgress(this.currentStep + 1);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.updateProgress(this.currentStep - 1);
    }
  }

  setStep(stepNumber) {
    if (stepNumber >= 0 && stepNumber <= this.totalSteps) {
      this.updateProgress(stepNumber);
    }
  }

  getCurrentStep() {
    return this.currentStep;
  }

  getTotalSteps() {
    return this.totalSteps;
  }
}