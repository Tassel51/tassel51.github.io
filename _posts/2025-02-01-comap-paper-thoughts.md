---
layout: blog_post
title: "Behind Our COMAP MCM Outstanding Winner Paper"
date: 2025-02-01 00:00:00 +0800
cover: /assets/images/covers/meisaiblog.jpg
tags: [Mathematical Modeling, COMAP MCM]
---
In January 2025, our team of three participated in the COMAP Mathematical Contest in Modeling (MCM/ICM) and was awarded the **Outstanding Winner** designation — ranking in the top 0.16% of over 30,000 participating teams worldwide. This post shares the story behind our paper *"From Models to Medals: The Winning Formula Behind the Data."*

## The Problem

We chose Problem C, which focused on data-driven modeling. The task required analyzing a large dataset, building predictive models, and presenting actionable insights — all within a 96-hour deadline.

## Our Approach

Our strategy centered on three key principles:

1. **Rapid Prototyping**: We spent the first 12 hours exploring multiple modeling approaches before committing to the most promising one.
2. **Data-Centric Thinking**: Rather than jumping to complex models, we invested significant time in understanding and cleaning the data.
3. **Clear Communication**: We structured our 25-page report to tell a compelling story — from problem understanding to model validation.

## Lessons Learned

The MCM experience taught me that mathematical modeling is as much about communication and teamwork as it is about technical skill. The best model in the world is worthless if you can't explain it clearly.

---

## 详细思路分享（中文）

> 以下内容谨代表我们当时比赛时的思考，如有解答不严谨处，还望指正！

### 第一问：Tobit-Mundlak-跨栏奥运奖牌数预测模型构建

第一题让我们开发一个模型来预测下一届奥运会每个国家的金牌、银牌、铜牌和总奖牌数，特别是与2024年相比表现进步或者退步的国家，以及潜在的首次奖牌获得者。从题目中的要求我们可以看出，**核心难点**在于预测首次奖牌获得者；因为金银铜牌奖牌数随每一届奥运会运动项目的设置以及国力的强弱，整体是呈一个**回归**趋势的，因此我们可以建立**类回归模型**用之前的奖牌数来预测后面的奖牌数。

但是首次获得奖牌的国家，由于之前奖牌数一直都为零，无法建立起合适的由之前奖牌数预测之后奖牌数的回归模型。

- 那遇到这种**截断类型**的数据到底该怎么处理呢？我们通过查阅文献发现了一个处理传统回归模型中截断数据的改进模型——[**Tobit模型**](https://www.kaggle.com/code/andyli2020/tobit-model)，Tobit模型是一种特殊的回归模型，它允许因变量取值范围在某个区间内，并且当因变量取值超出这个区间时，模型会将其截断。Tobit模型可以很好地处理因变量取值范围受限的情况，因此在处理截断数据时具有很好的效果。
  - Tobit模型引入了潜在变量来对奖牌数的潜在得分进行建模，假设只有当潜在得分大于零时才能观察到奖牌数。

- 之后，由于许多国家的奥运会表现可能受到**持续的、本国特有的因素的影响**，例如多次举办奥运会，运动员的长期平均表现，以及该国在某些项目上的持续参与。未能考虑到这些时不变因素可能会导致估计偏差，特别是在处理长期国家特征时；由此我们引入了**蒙德拉克修正**。我们将论文中提到的恒定国家因素（恒定国别特征）、长期赛事参与率和标准化奖牌平均水平等**持续随机变量与蒙德拉克修正相结合**。

由于在建立回归模型时，每年项目数量的变化也是影响其变化的重要因素（东道国优势项目、劣势项目、中性项目。对于有利项目和不利项目），我们考虑到东道国效应可能导致有利项目增加和不利项目减少，因此我们选择考虑了**外生变量的SARIMAX模型**。而中性项目往往不受东道国效应的影响，因此我们使用**ARIMA模型**进行预测；最后将**总项目数进行加和**而得到。后两届增长情况具体如下所示：

<img src="/blogs/paper_thinking/pics/1.png" style="max-width: 70%; display: block; margin: 0 auto;">

- 之后，我们为历史上**获得奖牌总数少于10枚的国家**构建**跨栏模型**来进行预测。**跨栏模型**通常包括两个阶段：步骤1，确定零与非零值：使用二元选择模型来预测观测值是否为零。这一阶段主要关注事件是否发生，即"障碍"是否被跨越。步骤2，量化非零值：对于非零观测值，使用适当的分布来模拟这些值的大小。这部分重点关注事件发生后观测到的数量或程度。

最后，我们根据这个模型分别预测了金牌数、银牌数和铜牌数，然后对结果进行汇总，得出总奖牌数并进行了排名。

### 第二问：用DRD-CE模型分析"great coach"效应

第二问让我们分析教练通过特殊的专业知识、战术指导和激励方法显著提高运动员的成绩，带领球队在国际比赛中取得优异成绩的现象。本问中我们采用了**差中差(Difference-in-Differences, DID)方法**与**双稳健估计量**，建立了一个分析"伟大教练效应"的专用模型。
