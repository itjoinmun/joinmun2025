package s3

import (
	"bytes"
	"context"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Uploader struct {
	Client     *s3.Client
	BucketName string
}

func NewS3Uploader(bucketName string) (*S3Uploader, error) {
	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	region := os.Getenv("AWS_REGION")

	if region == "" {
		region = "ap-southeast-2" // Default region if not specified
	}

	cfg, err := config.LoadDefaultConfig(
		context.Background(),
		config.WithRegion(region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			accessKey,
			secretKey,
			"",
		)),
	)
	if err != nil {
		return nil, err
	}

	return &S3Uploader{
		Client:     s3.NewFromConfig(cfg),
		BucketName: bucketName,
	}, nil
}

func (u *S3Uploader) UploadFile(file multipart.File, header *multipart.FileHeader, delegateEmail string, fileType string) (string, error) {
	buf := bytes.NewBuffer(nil)
	if _, err := buf.ReadFrom(file); err != nil {
		return "", err
	}

	key := fmt.Sprintf("%s/%s_%d%s", fileType, delegateEmail, time.Now().Unix(), filepath.Ext(header.Filename))

	_, err := u.Client.PutObject(context.Background(), &s3.PutObjectInput{
		Bucket: aws.String(u.BucketName),
		Key:    aws.String(key),
		Body:   bytes.NewReader(buf.Bytes()),
		ACL:    "private", // or "public-read" if you want public access
	})
	if err != nil {
		return "", err
	}

	return key, nil
}

func (u *S3Uploader) DeleteFile(key string) error {
	_, err := u.Client.DeleteObject(context.Background(), &s3.DeleteObjectInput{
		Bucket: aws.String(u.BucketName),
		Key:    aws.String(key),
	})
	return err
}
