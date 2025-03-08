import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.datasets as datasets

class CNN(nn.Module):
    def __init__(self):
        super(CNN,self).__init__()
        #same padding = filter-1/2
        self.cnn1 = nn.Conv2d(in_channels = 1, out_channels = 8, kernel_size = 3, stride = 1,padding = 1)
        #output_size of each of 8 feature maps = inputsize-filersize+2*padding/stride  +1 = 28
        self.batchnorm1 = nn.BatchNorm2d(8)
        self.relu = nn.ReLU()
        self.maxpool = nn.MaxPool2d(kernel_size = 2)
        #output size = 28/2 = 14
        self.cnn2 = nn.Conv2d(in_channels = 8,out_channels = 32, kernel_size = 5,stride = 1, padding = 2)
        #output size of each feature (14-5+4)+1 = 14
        self.batchnorm2 = nn.BatchNorm2d(32)
        #flatten 32 feature map: 7*7*32 = 1568
        self.fc1 = nn.Linear(1568,600)
        self.dropout = nn.Dropout(p = 0.5)
        self.fc2 = nn.Linear(600,10)
        
    def forward(self,x):
        out = self.cnn1(x)
        out = self.batchnorm1(out)
        out = self.relu(out)
        out = self.maxpool(out)
        out = self.cnn2(out)
        out = self.batchnorm2(out)
        out = self.relu(out)
        out = self.maxpool(out)
        
        # flatten the feature maps to feed to fc1(100,1568)
        out = out.view(-1,1568)
        
        
        out = self.fc1(out)
        out = self.relu(out)
        out = self.dropout(out)
        out = self.fc2(out)
        
        return out
    
        