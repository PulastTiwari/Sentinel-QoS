"""Train a LightGBM Sentry model from a CSV of precomputed features.

Usage:
  python train_sentry.py --csv training_data.csv --out sentry_model.pkl [--plot]

The script saves a payload with keys: model, label_encoder, feature_columns.
"""

import argparse
import sys
import os

missing = []
try:
    import joblib
except Exception:
    missing.append('joblib')
try:
    import pandas as pd
except Exception:
    missing.append('pandas')
try:
    import numpy as np
except Exception:
    missing.append('numpy')
try:
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import LabelEncoder
    from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
except Exception:
    missing.append('scikit-learn')
try:
    from lightgbm import LGBMClassifier
except Exception:
    missing.append('lightgbm')

if missing:
    print('ERROR: missing required Python packages: ' + ', '.join(missing))
    print('Install them with: pip install pandas scikit-learn lightgbm joblib')
    sys.exit(2)


def train_sentry_model(csv_path: str = 'training_data.csv', out_path: str = 'sentry_model.pkl', do_plot: bool = False):
    if not os.path.exists(csv_path):
        print(f"ERROR: CSV file not found: {csv_path}")
        return

    df = pd.read_csv(csv_path)
    if 'label' not in df.columns:
        print("ERROR: 'label' column not found in CSV")
        return

    X = df.drop(columns=['label'])
    y = df['label'].astype(str)

    # numeric features only
    X = X.select_dtypes(include=['number']).fillna(0)
    if X.shape[1] == 0:
        print('ERROR: no numeric feature columns found in CSV')
        return

    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y_enc, test_size=0.2, random_state=42, stratify=y_enc)

    clf = LGBMClassifier(n_estimators=100, max_depth=6, learning_rate=0.1)
    clf.fit(X_train, y_train)

    # Evaluate
    try:
        y_pred = clf.predict(X_test)
        # coerce to numpy 1-D arrays to avoid sparse/matrix typing issues
        def _to_numpy(a):
            try:
                if hasattr(a, 'toarray'):
                    a = a.toarray()
                arr = np.asarray(a)
                if arr.ndim > 1:
                    arr = arr.ravel()
                return arr
            except Exception:
                return np.asarray(a)

        y_test_np = _to_numpy(y_test)
        y_pred_np = _to_numpy(y_pred)

        acc = accuracy_score(y_test_np, y_pred_np)
        print(f"Model accuracy on the test set: {acc:.4f}")

        try:
            print('\nClassification report:')
            print(classification_report(y_test_np, y_pred_np, target_names=list(le.classes_)))
        except Exception:
            print('Warning: failed to compute classification report')

        if do_plot:
            try:
                import seaborn as sns
                import matplotlib.pyplot as plt
                cm = confusion_matrix(y_test_np, y_pred_np)
                plt.figure(figsize=(10, 8))
                sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=list(le.classes_), yticklabels=list(le.classes_))
                plt.title('Confusion Matrix')
                plt.ylabel('Actual')
                plt.xlabel('Predicted')
                plt.tight_layout()
                plt.savefig('confusion_matrix.png')
                print("Saved confusion matrix to 'confusion_matrix.png'")
            except Exception as e:
                print('Warning: plotting failed (missing libs?):', e)
    except Exception as e:
        print('Warning: evaluation failed:', e)

    # Save payload (model + encoder + feature list)
    payload = {'model': clf, 'label_encoder': le, 'feature_columns': list(X.columns)}
    try:
        joblib.dump(payload, out_path)
        print(f"Saved Sentry model payload to {out_path}")
    except Exception as e:
        print('ERROR: failed to save model payload:', e)

    # also save encoder separately for convenience
    try:
        joblib.dump(le, 'label_encoder.pkl')
        print("Saved label encoder to 'label_encoder.pkl'")
    except Exception:
        pass


def main():
    parser = argparse.ArgumentParser(description='Train a LightGBM Sentry model from CSV')
    parser.add_argument('--csv', default='training_data.csv', help='Path to CSV with features and label')
    parser.add_argument('--out', default='sentry_model.pkl', help='Output joblib payload path')
    parser.add_argument('--plot', action='store_true', help='Save confusion matrix image')
    args = parser.parse_args()

    train_sentry_model(csv_path=args.csv, out_path=args.out, do_plot=args.plot)


if __name__ == '__main__':
    main()